import express, {Router} from 'express';
import type {NextFunction, Response} from 'express';
import {UserController} from '../controllers/userController';
import {RequestCustom} from '../utils/types';
import {Service} from 'typedi';
import {validateDto} from '../middleware/validateDto';
import {authenticateUserToken} from '../middleware/authenticateToken';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  CheckExistDto,
  UpdatePasswordDto,
  UpdateUserDto,
  SendCodeVerify,
  ResetPasswordDto,
} from '../database/models/dtos/userDto';

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

    this.router.post('/password/forgot', validateDto(SendCodeVerify), async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.requestPasswordReset(req, res, next);
    });

    this.router.post('/password/reset', validateDto(ResetPasswordDto), async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.resetPassword(req, res, next);
    });

    this.router.post('/login', validateDto(LoginDto), async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.login(req, res, next);
    });

    this.router.post('/refresh-token', validateDto(RefreshTokenDto), async (req: RequestCustom, res: Response, next: NextFunction) => {
      await this.userController.refreshToken(req, res, next);
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
 * '/api/users/notifications':
 *   get:
 *     tags:
 *       - Users
 *     summary: List user notifications
 *     description: Retrieve notifications of the authenticated user with pagination and unread summary.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotificationListResponse'
 *       401:
 *         description: Unauthorized
 *
 * '/api/users/notifications/read':
 *   patch:
 *     tags:
 *       - Users
 *     summary: Mark notifications as read
 *     description: Update the last check timestamp so all notifications become read.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
 *     responses:
 *       200:
 *         description: Notifications marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotificationReadResponse'
 *       401:
 *         description: Unauthorized
 */
/**
 * @openapi
 * '/api/users/password/forgot':
 *   post:
 *     tags:
 *       - Users
 *     summary: Request password reset code
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendCodeVerifyInput'
 *     responses:
 *       200:
 *         description: Password reset code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendCodeVerifyOutput'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Account not found
 *
 * '/api/users/password/reset':
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset password using verification code
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResetPasswordOutput'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Account not found
 */
/**
 * @openapi
 * '/api/users/password':
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user password
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
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
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *           example:
 *             first_name: "Linh"
 *             last_name: "Nguyen"
 *             phone: "0912345678"
 *             country: "vn"
 *             gender: "female"
 *             address:
 *               detail: "12 Nguyễn Huệ"
 *               district: "Quận 1"
 *               province: "TP.HCM"
 *               district_id: "9b8d0e2a-1234-4e6f-a1c2-9876543210ab"
 *               province_id: "1a2b3c4d-5678-4f9a-b0c1-abcdef123456"
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
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
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
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
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
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
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
/**
 * @openapi
 * '/api/users/refresh-token':
 *   post:
 *     tags:
 *       - Users
 *     summary: Issue a new access token using a refresh token
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenInput'
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
