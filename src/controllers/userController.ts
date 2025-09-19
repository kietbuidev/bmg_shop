import {UserPassengerDto} from './../database/models/dtos/userDto';
import {UserService} from '../services/userService';
import type {NextFunction, Request, Response} from 'express';
import User from '../database/models/user';
import {RequestCustom, IConfig, IRequestQuery} from '../utils/types';
import {Service} from 'typedi';
import BuildResponse from '../utils/buildResponse';
import {CheckExistDto, DeleteUserDto, LoginDto, loginSocialDto, RegisterDto, UpdatePasswordDto, UserContactDto, VerifyCodeDto} from '../database/models/dtos/userDto';

@Service()
export class UserController {
  constructor(private userService: UserService ) {}

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
}
