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

    this.router.get(
      '/products',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.analyticsController.getProductAnalytics(req, res, next);
      },
    );

    this.router.get(
      '/posts',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.analyticsController.getPostAnalytics(req, res, next);
      },
    );

    this.router.get(
      '/contacts',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.analyticsController.getContactAnalytics(req, res, next);
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
 * '/api/analytics/products':
 *  get:
 *     tags:
 *     - Analytics
 *     summary: Product analytics overview
 *     description: Retrieve aggregate statistics for products grouped by status.
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
 *                    total_products:
 *                      type: integer
 *                    status_breakdown:
 *                      type: object
 *                      additionalProperties:
 *                        type: integer
 * '/api/analytics/posts':
 *  get:
 *     tags:
 *     - Analytics
 *     summary: Post analytics overview
 *     description: Retrieve aggregate statistics for posts grouped by status.
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
 *                    total_posts:
 *                      type: integer
 *                    is_active_breakdown:
 *                      type: object
 *                      properties:
 *                        active:
 *                          type: integer
 *                        inactive:
 *                          type: integer
 * '/api/analytics/contacts':
 *  get:
 *     tags:
 *     - Analytics
 *     summary: Contact analytics overview
 *     description: Retrieve aggregate statistics for contacts grouped by status.
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
 *                    total_contacts:
 *                      type: integer
 *                    status_breakdown:
 *                      type: object
 *                      additionalProperties:
 *                        type: integer
 */
