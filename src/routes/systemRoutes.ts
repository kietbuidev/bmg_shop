import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import CounterController from '../controllers/counterController';
import {validateDto} from '../middleware/validateDto';
import {CreateCounterDto} from '../database/models/dtos/counterDto';

@Service()
export class SystemRouter {
  private readonly router: Router;

  constructor(private readonly counterController: CounterController) {
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
