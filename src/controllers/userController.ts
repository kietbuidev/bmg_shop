import {UserPassengerDto} from './../database/models/dtos/userDto';
import {UserService} from '../services/userService';
import type {NextFunction, Request, Response} from 'express';
import User from '../database/models/user';
import {RequestCustom, IConfig, IRequestQuery} from '../utils/types';
import {Service} from 'typedi';
import BuildResponse from '../utils/buildResponse';
import {
  CheckExistDto,
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  UpdatePasswordDto,
  UpdateUserDto,
  SendCodeVerify,
  ResetPasswordDto,
} from '../database/models/dtos/userDto';

@Service()
export class UserController {
  constructor(private userService: UserService ) {}

  private getUserIdFromRequest(req: RequestCustom): string | undefined {
    const tokenUser = req.user as unknown as {userId?: string | number} | undefined;
    if (tokenUser?.userId !== undefined && tokenUser?.userId !== null) {
      return String(tokenUser.userId);
    }

    const headerValue = (req.headers['user_id'] ?? req.headers['user-id']) as string | string[] | undefined;
    if (Array.isArray(headerValue)) {
      const [first] = headerValue;
      if (first && first.trim().length > 0) {
        return first.trim();
      }
    }

    if (typeof headerValue === 'string' && headerValue.trim().length > 0) {
      return headerValue.trim();
    }

    return undefined;
  }

  async register(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const config = req.headers as unknown as IConfig;
      const body = req.body as RegisterDto;
      const user = await this.userService.register(config, body);

      res.status(200).json(
        BuildResponse.get({
          data: user,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserIdFromRequest(req);
      const config = {
        ...(req.headers as unknown as IConfig),
        user_id: userId,
      };

      const user = await this.userService.getCurrentUser(config);

      res.status(200).json(BuildResponse.get({data: user}));
    } catch (error) {
      next(error);
    }
  }

  async checkExist(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const config = req.headers as unknown as IConfig;
      const body = req.body as CheckExistDto;
      const isUser = await this.userService.checkExist(config, body);

      res.status(200).json(BuildResponse.get({data: isUser}));
    } catch (error) {
      next(error);
    }
  }

  async requestPasswordReset(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const body = req.body as SendCodeVerify;
      await this.userService.requestPasswordReset(body);

      res.status(200).json(
        BuildResponse.get({
          message: 'Password reset code sent!',
          data: true,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const body = req.body as ResetPasswordDto;
      const result = await this.userService.resetPasswordWithCode(body);

      res.status(200).json(
        BuildResponse.updated({
          message: 'Password reset successfully!',
          data: result,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const config = req.headers as unknown as IConfig;
      const userDto = req.body as LoginDto;
      const user = await this.userService.login(config, userDto);

      res.status(200).json(BuildResponse.get({data: user}));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async refreshToken(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const body = req.body as RefreshTokenDto;
      const tokens = await this.userService.refreshToken(body.refresh_token);

      res.status(200).json(BuildResponse.get({data: tokens}));
    } catch (error) {
      next(error);
    }
  }

  async getNotifications(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserIdFromRequest(req);
      const config = {
        ...(req.headers as unknown as IConfig),
        user_id: userId,
      };
      const query: IRequestQuery = {
        page: req.query?.page ? Number(req.query.page) : undefined,
        limit: req.query?.limit ? Number(req.query.limit) : undefined,
      };

      const notifications = await this.userService.getNotificationAndPaginateById(config, userId ?? '', query);

      res.status(200).json(BuildResponse.get({data: notifications}));
    } catch (error) {
      next(error);
    }
  }

  async markNotificationsAsRead(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserIdFromRequest(req);
      const config = {
        ...(req.headers as unknown as IConfig),
        user_id: userId,
      };

      const updated = await this.userService.markNotificationsAsRead(config);

      res.status(200).json(BuildResponse.updated({data: updated}));
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserIdFromRequest(req);
      const config = {
        ...(req.headers as unknown as IConfig),
        user_id: userId,
      };
      const body = req.body as UpdatePasswordDto;
      const updated = await this.userService.updatePassword(config, body);

      res.status(200).json(BuildResponse.updated({data: updated}));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const userId = this.getUserIdFromRequest(req);
      const config = {
        ...(req.headers as unknown as IConfig),
        user_id: userId,
      };
      const body = req.body as UpdateUserDto;
      const payload: Partial<User> = {
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
        country: body.country,
        address: body.address,
      };

      const user = await this.userService.updateUser(config, payload);
      res.status(200).json(BuildResponse.updated({data: user}));
    } catch (error) {
      next(error);
    }
  }
}
