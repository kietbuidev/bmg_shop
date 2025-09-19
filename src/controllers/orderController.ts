import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import BuildResponse from '../utils/buildResponse';
import OrderService from '../services/orderService';
import {CreateOrderDto} from '../database/models/dtos/orderDto';

@Service()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as CreateOrderDto;
      const order = await this.orderService.create(payload);

      res.status(201).json(
        BuildResponse.created({
          data: order,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
