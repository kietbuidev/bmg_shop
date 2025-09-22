import express, {Router} from 'express';
import type {NextFunction, Response} from 'express';
import {UserController} from '../controllers/userController';
import {RequestCustom} from '../utils/types';
import {Service} from 'typedi';
import {validateDto} from '../middleware/validateDto';
import {RegisterDto, LoginDto, CheckExistDto} from '../database/models/dtos/userDto';

@Service()
export class UserRouter {
  private router: Router;

  constructor(private userController: UserController) {
    this.router = express.Router();
    this.initRouter();
  }

  initRouter() {
    this.router.post('/register', validateDto(RegisterDto), async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.register(req, res, next);
    });

    this.router.post('/check-exist', validateDto(CheckExistDto), async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.checkExist(req, res, next);
    });

    this.router.post('/login', validateDto(LoginDto), async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.login(req, res, next);
    });
    
  }

  public getRouter() {
    return this.router;
  }
}