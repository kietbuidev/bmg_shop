import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import multer from 'multer';
import {Service} from 'typedi';
import CounterController from '../controllers/counterController';
import SystemController from '../controllers/systemController';
import {validateDto} from '../middleware/validateDto';
import {CreateCounterDto} from '../database/models/dtos/counterDto';
import {UploadImageDto} from '../database/models/dtos/systemDto';
import {google, drive_v3} from 'googleapis';

@Service()
export class SystemRouter {
  private readonly router: Router;
  private readonly upload = multer({storage: multer.memoryStorage()});

  constructor(
    private readonly counterController: CounterController,
    private readonly systemController: SystemController,
  ) {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      '/counter',
      validateDto(CreateCounterDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.counterController.create(req, res, next);
      },
    );

    this.router.post(
      '/upload-image',
      this.upload.single('file'),
      validateDto(UploadImageDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.systemController.uploadImage(req, res, next);
      },
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default SystemRouter;

/**
 * @openapi
 * '/api/system/counter':
 *  post:
 *     tags:
 *     - System
 *     summary: Save visitor counter
 *     description: Store visitor device information such as IP, OS, browser, and device.
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CounterCreateInput'
 *          example:
 *            ip: "203.0.113.42"
 *            os: "iOS 17"
 *            browser: "Safari"
 *            device: "iPhone 15"
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CounterDetailResponse'
 */
/**
 * @openapi
 * '/api/system/upload-image':
 *  post:
 *     tags:
 *     - System
 *     summary: Upload image to Google Drive
 *     description: Upload an image using multipart/form-data and specify the destination path in Google Drive.
 *     requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            required:
 *              - file
 *              - path
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *                description: Image file to upload.
 *              path:
 *                type: string
 *                description: Destination path in the storage service where the file should be placed.
 *                example: uploads/posts/featured
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UploadImageResponse'
 */
