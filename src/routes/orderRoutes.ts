import express, {Router} from 'express';
import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import OrderController from '../controllers/orderController';
import {validateDto} from '../middleware/validateDto';
import {authenticateUserToken} from '../middleware/authenticateToken';
import {CreateOrderDto, OrderListQueryDto, OrderSearchQueryDto, UpdateOrderStatusDto} from '../database/models/dtos/orderDto';

@Service()
export class OrderRouter {
  private readonly router: Router;

  constructor(private readonly orderController: OrderController) {
    this.router = express.Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      '/search',
      validateDto(OrderSearchQueryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.orderController.findByContact(req, res, next);
      },
    );

    this.router.get(
      '/',
      validateDto(OrderListQueryDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.orderController.list(req, res, next);
      },
    );

    this.router.post(
      '/',
      authenticateUserToken,
      validateDto(CreateOrderDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.orderController.create(req, res, next);
      },
    );

    this.router.patch(
      '/:id/status',
      validateDto(UpdateOrderStatusDto),
      async (req: Request, res: Response, next: NextFunction) => {
        await this.orderController.updateStatus(req, res, next);
      },
    );

    this.router.get(
      '/:id',
      async (req: Request, res: Response, next: NextFunction) => {
        await this.orderController.detail(req, res, next);
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
 * '/api/orders/search':
 *   get:
 *     tags:
 *       - Orders
 *     summary: Find orders by email or phone
 *     description: Retrieve the latest orders linked to a customer by email or phone number.
 *     parameters:
 *       - $ref: '#/components/parameters/language'
 *       - $ref: '#/components/parameters/platform'
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Customer email address.
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Customer phone number.
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: data has been received!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderDetailResponse'
 *       400:
 *         description: Email or phone is required
 */
/**
 * @openapi
 * '/api/orders':
 *  get:
 *     tags:
 *     - Orders
 *     summary: List orders
 *     description: Retrieve orders with pagination and optional status filter
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          example: 1
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          example: 10
 *      - in: query
 *        name: status
 *        schema:
 *          type: string
 *          example: PENDING
 *          enum:
 *            - PENDING
 *            - CONFIRMED
 *            - PROCESSING
 *            - COMPLETED
 *            - ALL
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
 *                rows:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Order'
 *                pagination:
 *                  type: object
 *                  properties:
 *                    total_page:
 *                      type: integer
 *                    per_page:
 *                      type: integer
 *                    current_page:
 *                      type: integer
 *                    count:
 *                      type: integer
 *  post:
 *     tags:
 *     - Orders
 *     summary: Create order
 *     description: Create a new order with customer information and product list
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *     security:
 *      - bearerAuth: []
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
 *
 * '/api/orders/{id}/status':
 *  patch:
 *     tags:
 *     - Orders
 *     summary: Update order status
 *     description: Update the status of an order by id
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - status
 *            properties:
 *              status:
 *                type: string
 *                enum:
 *                  - PENDING
 *                  - CONFIRMED
 *                  - PROCESSING
 *                  - COMPLETED
 *                example: PROCESSING
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderDetailResponse'
 *      400:
 *        description: Validation error
 *      404:
 *        description: Order not found
 *
 * '/api/orders/{id}':
 *  get:
 *     tags:
 *     - Orders
 *     summary: Get order detail
 *     description: Retrieve detailed information for a specific order.
 *     parameters:
 *      - $ref: '#/components/parameters/language'
 *      - $ref: '#/components/parameters/platform'
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/OrderDetailResponse'
 *      404:
 *        description: Order not found
 */
