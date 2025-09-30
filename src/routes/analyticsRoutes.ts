import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import AnalyticsController from '../controllers/analyticsController';

@Service()
export class AnalyticsRouter {
  private readonly router: Router;

  constructor(private readonly analyticsController: AnalyticsController) {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      '/orders',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.analyticsController.getOrderAnalytics(req, res, next);
      },
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default AnalyticsRouter;

/**
 * @openapi
 * '/api/analytics/orders':
 *  get:
 *     tags:
 *     - Analytics
 *     summary: Order analytics overview
 *     description: Retrieve aggregate statistics for orders grouped by status.
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: integer
 *                message:
 *                  type: string
 *                data:
 *                  type: object
 *                  properties:
 *                    total_orders:
 *                      type: integer
 *                    status_breakdown:
 *                      type: object
 *                      additionalProperties:
 *                        type: integer
 *                    unknown_status_total:
 *                      type: integer
 */
