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

// Register
/**
 * @openapi
 * '/api/users/register':
 *  post:
 *     tags:
 *     - Users
 *     summary: Register
 *     description: Register
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RegisterResponse'
 *      400:
 *        description: Bad request
 *        content:
 *         application/json:
 *           examples:
 *            ACCOUNT_EXIST:
 *              summary: account exists
 *              value:
 *               reason: "ACCOUNT_EXIST: Account exists"
 *               status: 400
 *            PASSWORD_NOT_MATCH:
 *              summary: Password not match
 *              value:
 *               reason: "PASSWORD_NOT_MATCH: Password not match"
 *               status: 400
 */

// Check Exist response
/**
 * @openapi
 * '/api/users/check-exist':
 *  post:
 *     tags:
 *     - Users
 *     summary: Check exist email
 *     description: Check exist email
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CheckExistInput'
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */

// Verify Code
/**
 * @openapi
 * '/api/users/verify-code':
 *  post:
 *     tags:
 *     - Users
 *     summary: Verify Code
 *     description: The verification code expires in 1 hour
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/VerifyInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/VerifyOutput'
 *      400:
 *        description: Bad request
 */
