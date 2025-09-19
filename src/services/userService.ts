import {Service} from 'typedi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';
import User from '../database/models/user';
import UserRepository from '../database/repositories/user';
import {CustomError, NotFoundError} from '../utils/customError';
import {ConfigDefault, HTTPCode, StatusActive} from '../utils/enums';
import {IConfig, IPaginateResult, IRequestQuery} from '../utils/types';
import authJwt from '../middleware/authJwt';
import configJwt from '../config/jwt';
import {payloadToken} from '../database/models/dtos/jwtDto';
import {
  RegisterDto,
  LoginDto,
  loginSocialDto,
  VerifyCodeDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  DeleteUserDto,
} from '../database/models/dtos/userDto';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

@Service()
export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
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

  private buildPayload(user: User): payloadToken {
    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email;
    return {
      user_id: user.id,
      full_name: fullName,
      alias: this.buildAlias(user.first_name, user.last_name),
      avatar: undefined,
      tier: null,
      email: user.email,
    };
  }

  private async issueTokens(user: User, extras?: {device_token?: string | null; fcm_token?: string | null}): Promise<AuthTokens> {
    const payload = this.buildPayload(user);
    const [access, refresh] = await Promise.all([
      authJwt.signAccessToken(payload),
      authJwt.signRefreshToken(String(user.id)),
    ]);

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

  async register(config: IConfig, registerUser: RegisterDto): Promise<Record<string, unknown>> {
    this.normalizeConfig(config);

    if (registerUser.password !== registerUser.confirm_password) {
      throw new CustomError(HTTPCode.REQUIRED, 'PASSWORDS_DO_NOT_MATCH');
    }

    const existing = await this.userRepository.getByOne({
      where: {
        email: registerUser.email,
      },
    });

    const hashedPassword = await this.hashPassword(registerUser.password);

    let user: User;
    if (existing) {
      if (existing.status !== StatusActive.Off) {
        throw new CustomError(HTTPCode.BAD_REQUEST, 'ACCOUNT_ALREADY_EXISTS');
      }

      await this.userRepository.update(existing.id, {
        first_name: registerUser.first_name,
        last_name: registerUser.last_name,
        phone: registerUser.phone,
        phone_code: registerUser.phone_code,
        country: registerUser.country,
        password: hashedPassword,
        status: StatusActive.On,
      } as Partial<User>);
      const updated = await this.userRepository.getById(existing.id);
      user = updated ?? existing;
    } else {
      user = await this.userRepository.create({
        first_name: registerUser.first_name,
        last_name: registerUser.last_name,
        email: registerUser.email,
        phone: registerUser.phone,
        phone_code: registerUser.phone_code,
        country: registerUser.country,
        password: hashedPassword,
        status: StatusActive.On,
      } as unknown as User);
    }

    return this.sanitizeUser(user);
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

  async login(config: IConfig, userDto: LoginDto): Promise<AuthTokens> {
    this.normalizeConfig(config);
    const user = await this.userRepository.getByOne({
      where: {
        email: userDto.email,
      },
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

    return this.issueTokens(user, {
      device_token: userDto.device_token ?? null,
      fcm_token: userDto.fcm_token ?? null,
    });
  }

  async loginSocial(): Promise<never> {
    throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'SOCIAL_LOGIN_NOT_AVAILABLE');
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
      const decoded = jwt.verify(token, configJwt.secret) as {userId?: number};
      if (decoded?.userId) {
        await this.userRepository.update(decoded.userId, {
          remember_token: null,
          refresh_token: null,
          device_token: null,
          fcm_token: null,
        } as Partial<User>);
      }
    } catch (error) {
      // ignore invalid tokens
    }

    return true;
  }

  async sendCodeVerify(): Promise<never> {
    throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'VERIFICATION_NOT_AVAILABLE');
  }

  async verifyCode(): Promise<never> {
    throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'VERIFICATION_NOT_AVAILABLE');
  }

  async resetPassword(): Promise<never> {
    throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'RESET_PASSWORD_NOT_AVAILABLE');
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
      phone_code: userDto.phone_code ?? user.phone_code,
      country: userDto.country ?? user.country,
      birthday: userDto.birthday ?? user.birthday,
      address: userDto.address ?? user.address,
      title: userDto.title ?? user.title,
    } as Partial<User>);

    const updated = await this.userRepository.getById(user.id);
    return this.sanitizeUser(updated ?? user);
  }

  async uploadAvatarUser(): Promise<never> {
    throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'UPLOAD_AVATAR_NOT_AVAILABLE');
  }

  async deleteAvatarUser(): Promise<boolean> {
    throw new CustomError(HTTPCode.CAN_NOT_PERFORMED, 'DELETE_AVATAR_NOT_AVAILABLE');
  }

  async updateFcmTokenUser(config: IConfig, fcmToken: string): Promise<boolean> {
    const normalised = this.normalizeConfig(config);
    if (!normalised.user_id) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'USER_CONTEXT_REQUIRED');
    }

    await this.userRepository.update(normalised.user_id, {fcm_token: fcmToken} as Partial<User>);
    return true;
  }

  async deleteUser(config: IConfig, body: DeleteUserDto): Promise<boolean> {
    const normalised = this.normalizeConfig(config);
    if (!normalised.user_id) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'USER_CONTEXT_REQUIRED');
    }

    const user = await this.userRepository.getById(normalised.user_id);
    if (!user) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    }

    const matches = await this.comparePassword(body.password, user.password);
    if (!matches) {
      throw new CustomError(HTTPCode.INVALID, 'INVALID_PASSWORD');
    }

    await this.userRepository.delete(user.id);
    return true;
  }

  async getUserById(config: IConfig, id: number): Promise<Record<string, unknown>> {
    this.normalizeConfig(config);
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundError('ACCOUNT_NOT_FOUND');
    }
    return this.sanitizeUser(user);
  }

  async getContact(): Promise<unknown[]> {
    return [];
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'REFRESH_TOKEN_REQUIRED');
    }

    try {
      jwt.verify(refreshToken, configJwt.secret);
    } catch (error) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'INVALID_REFRESH_TOKEN');
    }

    const user = await this.userRepository.getByOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user) {
      throw new CustomError(HTTPCode.UNAUTHORIZE, 'INVALID_REFRESH_TOKEN');
    }

    return this.issueTokens(user);
  }

  async getLocation(config: IConfig, ipAddress: string | string[] | undefined): Promise<Record<string, unknown>> {
    const normalised = this.normalizeConfig(config);
    const ip = Array.isArray(ipAddress) ? ipAddress[0] : ipAddress;
    return {
      ip: ip ?? null,
      country: normalised.country,
    };
  }

  async getTotalNotifications(): Promise<number> {
    return 0;
  }

  async getLatestNotificationById(): Promise<unknown[]> {
    return [];
  }

  async getNotificationAndPaginateById(_config: IConfig, _id: number, query: IRequestQuery): Promise<IPaginateResult<unknown>> {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    return {
      rows: [],
      pagination: {
        count: 0,
        current_page: page,
        per_page: limit,
        total_page: 0,
      },
    };
  }

  async markReadNotification(): Promise<boolean> {
    return true;
  }

  async getLoyaltyById(): Promise<Record<string, unknown>> {
    return {};
  }

  async getCoinsById(): Promise<unknown[]> {
    return [];
  }

  async getTierForUser(): Promise<unknown[]> {
    return [];
  }

  async getTierPerks(): Promise<unknown[]> {
    return [];
  }
}
