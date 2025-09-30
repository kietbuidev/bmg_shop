import express, {Router} from 'express';
import type {NextFunction, Response} from 'express';
import {UserController} from '../controllers/userController';
import {RequestCustom} from '../utils/types';
import {Service} from 'typedi';
import {validateDto} from '../middleware/validateDto';
import {authenticateUserToken} from '../middleware/authenticateToken';
import {RegisterDto, LoginDto, CheckExistDto, UpdatePasswordDto, UpdateUserDto} from '../database/models/dtos/userDto';

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

    this.router.get('/me', authenticateUserToken, async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.getCurrentUser(req, res, next);
    });

    this.router.put('/password', authenticateUserToken, validateDto(UpdatePasswordDto), async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.updatePassword(req, res, next);
    });

    this.router.patch('/profile', authenticateUserToken, validateDto(UpdateUserDto), async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.updateUser(req, res, next);
    });

    this.router.get('/notifications', authenticateUserToken, async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.getNotifications(req, res, next);
    });

    this.router.patch('/notifications/read', authenticateUserToken, async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.markNotificationsAsRead(req, res, next);
    });
  }

  public getRouter() {
    return this.router;
  }
}

/**
 * @openapi
 * '/api/users/password':
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdatePasswordInput'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserUpdatePasswordResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 * '/api/users/profile':
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserOutput'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
/**
 * @openapi
 * '/api/users/me':
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve authenticated user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: Unauthorized
 */
/**
 * @openapi
 * '/api/users/register':
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Bad request
 *
 * '/api/users/login':
 *   post:
 *     tags:
 *       - Users
 *     summary: Authenticate user credentials
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
