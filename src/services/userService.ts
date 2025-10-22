import {Service} from 'typedi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';
import User from '../database/models/user';
import Role from '../database/models/role';
import Notification from '../database/models/notification';
import UserRepository from '../database/repositories/user';
import NotificationRepository from '../database/repositories/notification';
import {CustomError, NotFoundError} from '../utils/customError';
import {ConfigDefault, HTTPCode, StatusActive} from '../utils/enums';
import {IConfig, IPaginateResult, IRequestQuery} from '../utils/types';
import authJwt from '../middleware/authJwt';
import configJwt from '../config/jwt';
import {
  RegisterDto,
  LoginDto,
  UpdatePasswordDto,
  DeleteUserDto,
  SendCodeVerify,
  ResetPasswordDto,
} from '../database/models/dtos/userDto';
import {logger} from '../utils/logger';
import {sendMail} from '../utils/mailer';
import {passwordResetStore} from '../utils/passwordResetStore';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

type NotificationResponse = Record<string, unknown> & {
  is_new: boolean;
  is_read: boolean;
};

@Service()
export class UserService {
  private readonly userRepository: UserRepository;
  private readonly notificationRepository: NotificationRepository;
  private readonly roleInclude = [{model: Role, as: 'roles',}];

  constructor() {
    this.userRepository = new UserRepository();
    this.notificationRepository = new NotificationRepository();
  }

  private normalizeConfig(partial: Partial<IConfig> | undefined): IConfig {
    return {
      tenant: partial?.tenant ?? ConfigDefault.tenant,
      language: partial?.language ?? ConfigDefault.language,
      currency: partial?.currency ?? ConfigDefault.currency,
      country: partial?.country ?? ConfigDefault.country,
      platform: partial?.platform ?? 'web',
      user_id: partial?.user_id,
      x_api_key: partial?.x_api_key,
    };
  }

  private sanitizeUser(user: User): Record<string, unknown> {
    const plain = user.get({plain: true}) as any;
    delete plain.password;
    delete plain.remember_token;
    delete plain.refresh_token;
    if (Array.isArray(plain.roles)) {
      plain.roles = plain.roles
        .filter(Boolean)
        .map((role: Role) => ({
          id: role.id,
          name: role.name,
        }));
      plain.is_admin = plain.roles.some((role: {name: string}) => (role.name ?? '').toLowerCase() === 'admin');
    } else {
      plain.roles = [];
      plain.is_admin = false;
    }
    return plain;
  }

  private buildAlias(firstName?: string | null, lastName?: string | null): string {
    const first = (firstName ?? '').trim();
    const last = (lastName ?? '').trim();
    const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    if (initials.trim().length > 0) {
      return initials;
    }
    const fallback = `${first} ${last}`.trim();
    return fallback.slice(0, 2).toUpperCase() || 'US';
  }

  private buildPayload(user: User): any {
    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email;
    const roles = Array.isArray(user.roles) ? user.roles.map(role => role.name) : [];
    const isAdmin = roles.some(role => (role ?? '').toLowerCase() === 'admin');
    return {
      user_id: user.id,
      full_name: fullName,
      alias: this.buildAlias(user.first_name, user.last_name),
      avatar: undefined,
      tier: null,
      email: user.email,
      roles,
      is_admin: isAdmin,
    };
  }

  private generateResetCode(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private async issueTokens(user: User, extras?: {device_token?: string | null; fcm_token?: string | null}): Promise<AuthTokens> {
    const payload = this.buildPayload(user);
    const [access, refresh] = await Promise.all([authJwt.signAccessToken(payload), authJwt.signRefreshToken(String(user.id))]);

    await this.userRepository.update(user.id, {
      remember_token: access as string,
      refresh_token: refresh as string,
      device_token: extras?.device_token ?? null,
      fcm_token: extras?.fcm_token ?? null,
    } as Partial<User>);

    return {
      access_token: access as string,
      refresh_token: refresh as string,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(password: string, hashed: string | null): Promise<boolean> {
    if (!hashed) {
      return false;
    }
    return bcrypt.compare(password, hashed);
  }

  async register(config: IConfig, registerUser: RegisterDto): Promise<AuthTokens & {user: Record<string, unknown>}> {
    this.normalizeConfig(config);

    if (registerUser.password !== registerUser.confirm_password) {
      throw new CustomError(HTTPCode.REQUIRED, 'PASSWORDS_DO_NOT_MATCH');
    }

    const existing = await this.userRepository.getByOne({
      where: {
        email: registerUser.email,
      },
    });

    if (existing) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'ACCOUNT_ALREADY_EXISTS');
    }

    const hashedPassword = await this.hashPassword(registerUser.password);
    const normalizedBirthday = registerUser.birthday ? new Date(registerUser.birthday) : null;
    const birthdayValue = normalizedBirthday && !Number.isNaN(normalizedBirthday.valueOf()) ? normalizedBirthday : null;
    const user: User = await this.userRepository.create({
      first_name: registerUser.first_name,
      last_name: registerUser.last_name,
      email: registerUser.email,
      phone: registerUser.phone,
      gender: registerUser.gender,
      birthday: birthdayValue,
      password: hashedPassword,
      status: StatusActive.On,
    } as unknown as User);

    try {
      const defaultRole = await Role.findOne({
        where: {
          name: {
            [Op.iLike]: 'customer',
          },
        },
      });

      if (defaultRole) {
        await user.$set('roles', [defaultRole.id]);
      }
    } catch (error) {
      // Default role assignment failed; proceed without blocking registration
      logger.warn('Failed to assign default role on register', error as Error);
    }

    const reloaded = await this.userRepository.getById(user.id, {include: this.roleInclude});
    const userWithRoles = reloaded ?? user;
    const sanitized = this.sanitizeUser(userWithRoles);
    const tokens = await this.issueTokens(userWithRoles);

    return {
      ...tokens,
      user: sanitized,
    };
  }

  async checkExist(config: IConfig, body: {email: string}): Promise<boolean> {
    this.normalizeConfig(config);
    const user = await this.userRepository.getByOne({
      where: {
        email: body.email,
        status: {
          [Op.ne]: StatusActive.Off,
        },
      },
    });
    return Boolean(user);
  }

  async requestPasswordReset(body: SendCodeVerify): Promise<boolean> {
    const email = body.email.trim().toLowerCase();
    const user = await this.userRepository.getByOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    }

    const code = this.generateResetCode();
    passwordResetStore.set(email, code);

    const html = `
      <p>Xin chào ${user.first_name ?? user.last_name ?? 'bạn'},</p>
      <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản tại BMG Shop.</p>
      <p>Mã xác nhận của bạn là: <strong>${code}</strong></p>
      <p>Mã này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ BMG Shop</p>
    `;

    await sendMail({
      to: email,
      subject: 'BMG Shop - Mã xác nhận đặt lại mật khẩu',
      html,
      text: `Ma xac nhan cua ban la: ${code}. Ma het han sau 15 phut.`,
    });

    return true;
  }

  async resetPasswordWithCode(body: ResetPasswordDto): Promise<boolean> {
    const email = body.email.trim().toLowerCase();
    if (body.password !== body.confirm_password) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'PASSWORDS_DO_NOT_MATCH');
    }

    const isValidCode = passwordResetStore.verify(email, body.code_reset_password.trim());
    if (!isValidCode) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_RESET_CODE');
    }

    const user = await this.userRepository.getByOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    }

    const hashed = await this.hashPassword(body.password);
    await this.userRepository.update(user.id, {
      password: hashed,
    } as Partial<User>);

    passwordResetStore.clear(email);
    return true;
  }

  async login(config: IConfig, userDto: LoginDto): Promise<AuthTokens> {
    this.normalizeConfig(config);
    const user = await this.userRepository.getByOne({
      where: {
        email: userDto.email,
      },
      include: this.roleInclude,
    });

    if (!user) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_LOGIN_CREDENTIALS');
    }

    if (user.status === StatusActive.Off) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'ACCOUNT_DISABLED');
    }

    const isValid = await this.comparePassword(userDto.password, user.password);
    if (!isValid) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'INVALID_LOGIN_CREDENTIALS');
    }

    const tokens = await this.issueTokens(user, {
      device_token: userDto.device_token ?? null,
      fcm_token: userDto.fcm_token ?? null,
    });

    return {
      ...tokens
    };
  }


  async logout(authHeader: string): Promise<boolean> {
    if (!authHeader) {
      return true;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return true;
    }

    try {
      const decoded = jwt.verify(token, configJwt.secret) as {userId?: string | number};
      if (decoded?.userId) {
        await this.userRepository.update(String(decoded.userId), {
          remember_token: null,
          refresh_token: null,
          device_token: null,
        } as Partial<User>);
      }
    } catch (error) {
      // ignore invalid tokens
    }

    return true;
  }

  async getCurrentUser(config: IConfig): Promise<Record<string, unknown>> {
    const normalized = this.normalizeConfig(config);
    if (!normalized.user_id) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'USER_CONTEXT_REQUIRED');
    }

    const user = await this.userRepository.getById(normalized.user_id, {include: this.roleInclude});
    if (!user) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    }

    return this.sanitizeUser(user);
  }

  async updatePassword(config: IConfig, updatePassword: UpdatePasswordDto): Promise<boolean> {
    const normalised = this.normalizeConfig(config);
    if (!normalised.user_id) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'USER_CONTEXT_REQUIRED');
    }

    const user = await this.userRepository.getById(normalised.user_id);
    if (!user) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    }

    if (updatePassword.password) {
      const match = await this.comparePassword(updatePassword.password, user.password);
      if (!match) {
        throw new CustomError(HTTPCode.INVALID, 'INVALID_PASSWORD');
      }
    }

    if (updatePassword.new_password !== updatePassword.new_confirm_password) {
      throw new CustomError(HTTPCode.ERROR_CONFLICT, 'PASSWORDS_DO_NOT_MATCH');
    }

    const hashed = await this.hashPassword(updatePassword.new_password);
    await this.userRepository.update(user.id, {password: hashed} as Partial<User>);
    return true;
  }

  async updateUser(config: IConfig, userDto: Partial<User>): Promise<Record<string, unknown>> {
    const normalised = this.normalizeConfig(config);
    if (!normalised.user_id) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'USER_CONTEXT_REQUIRED');
    }

    const user = await this.userRepository.getById(normalised.user_id);
    if (!user) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    }

    await this.userRepository.update(user.id, {
      first_name: userDto.first_name ?? user.first_name,
      last_name: userDto.last_name ?? user.last_name,
      phone: userDto.phone ?? user.phone,
      country: userDto.country ?? user.country,
      address: userDto.address ?? user.address,
    } as Partial<User>);

    const updated = await this.userRepository.getById(user.id, {include: this.roleInclude});
    return this.sanitizeUser(updated ?? user);
  }

  // async uploadAvatarUser(): Promise<never> {
  //   throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'UPLOAD_AVATAR_NOT_AVAILABLE');
  // }

  // async deleteAvatarUser(): Promise<boolean> {
  //   throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'DELETE_AVATAR_NOT_AVAILABLE');
  // }

  // async deleteUser(config: IConfig, body: DeleteUserDto): Promise<boolean> {
  //   const normalised = this.normalizeConfig(config);
  //   if (!normalised.user_id) {
  //     throw new CustomError(HTTPCode.UNAUTHORIZE, 'USER_CONTEXT_REQUIRED');
  //   }

  //   const user = await this.userRepository.getById(normalised.user_id);
  //   if (!user) {
  //     throw new NotFoundError('ACCOUNT_NOT_FOUND');
  //   }

  //   const matches = await this.comparePassword(body.password, user.password);
  //   if (!matches) {
  //     throw new CustomError(HTTPCode.INVALID, 'INVALID_PASSWORD');
  //   }

  //   await this.userRepository.delete(user.id);
  //   return true;
  // }

  async getUserById(config: IConfig, id: number): Promise<Record<string, unknown>> {
    this.normalizeConfig(config);
    const user = await this.userRepository.getById(id, {include: this.roleInclude});
    if (!user) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    }
    return this.sanitizeUser(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'REFRESH_TOKEN_REQUIRED');
    }

    let decoded: {userId?: string | number} | null = null;
    try {
      decoded = jwt.verify(refreshToken, configJwt.secret) as {userId?: string | number};
    } catch (error) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'INVALID_REFRESH_TOKEN');
    }

    if (!decoded?.userId) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'INVALID_REFRESH_TOKEN');
    }

    const user = await this.userRepository.getByOne({
      where: {
        id: decoded.userId,
        refresh_token: refreshToken,
      },
    });

    if (!user || user.status === StatusActive.Off) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'INVALID_REFRESH_TOKEN');
    }

    return this.issueTokens(user);
  }

  private computeNotificationReadState(notification: Notification, lastCheck: Date | null): boolean {
    if (!lastCheck) {
      return true;
    }
    const createdAt = notification.created_at instanceof Date ? notification.created_at : new Date(notification.created_at);
    return createdAt > lastCheck;
  }

  async getNotificationAndPaginateById(config: IConfig, id: string | number, query: IRequestQuery): Promise<IPaginateResult<Record<string, unknown>>> {
    const normalised = this.normalizeConfig(config);
    const targetId = id ?? normalised.user_id;

    if (!targetId) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'USER_CONTEXT_REQUIRED');
    }

    const user = await this.userRepository.getById(String(targetId));
    if (!user) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    }

    const result = await this.notificationRepository.findAndPaginate(
      {
        where: {
          user_to: String(targetId),
        },
        order: [['created_at', 'DESC']],
      },
      query,
    );

    const lastCheck = user.last_check_notifcation ? new Date(user.last_check_notifcation) : null;
    const rows = result.rows.map<NotificationResponse>((notification) => {
      const plain = notification.toJSON() as unknown as Record<string, unknown>;
      const isNew = this.computeNotificationReadState(notification, lastCheck);
      return {
        ...plain,
        is_new: isNew,
        is_read: !isNew,
      };
    });

    const unreadCount = rows.filter((row) => row.is_new).length;

    return {
      rows,
      pagination: result.pagination,
      summay_status: {
        unread_count: unreadCount,
        has_new: unreadCount > 0,
        last_check: lastCheck,
      },
    };
  }

  async markNotificationsAsRead(config: IConfig): Promise<boolean> {
    const normalised = this.normalizeConfig(config);
    if (!normalised.user_id) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'USER_CONTEXT_REQUIRED');
    }

    await this.userRepository.update(normalised.user_id, {
      last_check_notifcation: new Date(),
    } as Partial<User>);

    return true;
  }
}
