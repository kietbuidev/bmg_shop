import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import multer from 'multer';
import {Service} from 'typedi';
import CounterController from '../controllers/counterController';
import SystemController from '../controllers/systemController';
import {validateDto} from '../middleware/validateDto';
import {CreateCounterDto, GetCounterChartQueryDto} from '../database/models/dtos/counterDto';
import {UploadImageDto, GetDistrictsQueryDto} from '../database/models/dtos/systemDto';

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

    this.router.get('/provinces', async (req: Request, res: Response, next: NextFunction) => {
      await this.systemController.listProvinces(req, res, next);
    });

    this.router.get(
      '/districts',
      validateDto(GetDistrictsQueryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.systemController.listDistrictsByProvince(req, res, next);
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
 *     summary: Upload image to Cloudinary
 *     description: Upload an image using multipart/form-data and specify the destination folder in Cloudinary.
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
/**
 * @openapi
 * '/api/system/provinces':
 *  get:
 *     tags:
 *     - System
 *     summary: List all provinces
 *     description: Retrieve the complete list of provinces.
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ProvinceListResponse'
 */
/**
 * @openapi
 * '/api/system/districts':
 *  get:
 *     tags:
 *     - System
 *     summary: List districts by province
 *     description: Retrieve all districts that belong to the provided province.
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: query
 *        name: province_id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *        description: Province identifier used to filter districts.
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/DistrictListResponse'
 */
