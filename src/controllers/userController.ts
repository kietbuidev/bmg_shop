import {UserPassengerDto} from './../database/models/dtos/userDto';
import {UserService} from '../services/userService';
import type {NextFunction, Request, Response} from 'express';
import User from '../database/models/user';
import {RequestCustom, IConfig, IRequestQuery} from '../utils/types';
import {Service} from 'typedi';
import BuildResponse from '../utils/buildResponse';
import {
  CheckExistDto,
  DeleteUserDto,
  LoginDto,
  loginSocialDto,
  RegisterDto,
  UpdatePasswordDto,
  UpdateUserDto,
  UserContactDto,
  VerifyCodeDto,
} from '../database/models/dtos/userDto';

@Service()
export class UserController {
  constructor(private userService: UserService ) {}

  private getUserIdFromRequest(req: RequestCustom): number | undefined {
    const tokenUser = req.user as unknown as {userId?: number} | undefined;
    if (tokenUser?.userId !== undefined && tokenUser?.userId !== null) {
      const parsed = Number(tokenUser.userId);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    const headerValue = (req.headers['user_id'] ?? req.headers['user-id']) as string | string[] | undefined;
    if (Array.isArray(headerValue)) {
      const [first] = headerValue;
      const parsed = Number(first);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    if (typeof headerValue === 'string') {
      const parsed = Number(headerValue);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
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

  async login(req: RequestCustom, res: Response, next: NextFunction) {
    try {
      const config = req.headers as unknown as IConfig;
      const userDto = req.body as LoginDto;
      const user = await this.userService.login(config, userDto);

      res.status(200).json(BuildResponse.get({data: user}));
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
        phone_code: body.phone_code,
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
