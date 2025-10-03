import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import multer from 'multer';
import {Service} from 'typedi';
import CounterController from '../controllers/counterController';
import SystemController from '../controllers/systemController';
import {validateDto} from '../middleware/validateDto';
import {CreateCounterDto, GetCounterChartQueryDto} from '../database/models/dtos/counterDto';
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

    this.router.get(
      '/counter/chart',
      validateDto(GetCounterChartQueryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.counterController.chart(req, res, next);
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
 * '/api/system/counter/chart':
 *  get:
 *     tags:
 *     - System
 *     summary: Visitor counter chart
 *     description: Retrieve aggregated visitor statistics for chart visualizations.
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: query
 *        name: start_date
 *        schema:
 *          type: string
 *          format: date
 *        required: false
 *        description: ISO date (YYYY-MM-DD) marking the beginning of the range (inclusive).
 *      - in: query
 *        name: end_date
 *        schema:
 *          type: string
 *          format: date
 *        required: false
 *        description: ISO date (YYYY-MM-DD) marking the end of the range (inclusive).
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CounterChartResponse'
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
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *                description: Image file to upload.
 *              type:
 *                type: string
 *                description: Logical folder preset to apply for the upload.
 *                enum:
 *                  - categories
 *                  - posts
 *                  - products
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UploadImageResponse'
 */
