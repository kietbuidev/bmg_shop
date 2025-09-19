import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import OrderController from '../controllers/orderController';
import {validateDto} from '../middleware/validateDto';
import {CreateOrderDto} from '../database/models/dtos/orderDto';

@Service()
export class OrderRouter {
  private readonly router: Router;

  constructor(private readonly orderController: OrderController) {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      '/',
      validateDto(CreateOrderDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.orderController.create(req, res, next);
      },
    );
  }

  public getRouter() {
    return this.router;
  }
}

export default OrderRouter;

/**
 * @openapi
 * '/api/orders':
 *  post:
 *     tags:
 *     - Orders
 *     summary: Create order
 *     description: Create a new order with customer information and product list
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/OrderCreateInput'
 *          example:
 *            customer:
 *              full_name: "Jane Doe"
 *              email: "jane@example.com"
 *              phone: "+84 123 456 789"
 *              address: "123 Fashion Street"
 *              note: "Deliver after 6 PM"
 *            items:
 *              - product_id: "1a2b3c4d-5e6f-7a8b-9c0d-ef1234567890"
 *                quantity: 2
 *                selected_size: "M"
 *                selected_color: "red"
 *              - product_id: "0f9e8d7c-6b5a-4e3d-2c1b-a09876543210"
 *                quantity: 1
 *                selected_size: "L"
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderDetailResponse'
 *      400:
 *        description: Validation or business error
 */
