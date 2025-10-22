import type {NextFunction, Request, Response} from 'express';
import {Service} from 'typedi';
import {validate as uuidValidate, version as uuidVersion} from 'uuid';
import BuildResponse from '../utils/buildResponse';
import OrderService from '../services/orderService';
import {CreateOrderDto, OrderListQueryDto, OrderSearchQueryDto, UpdateOrderStatusDto} from '../database/models/dtos/orderDto';
import {CustomError} from '../utils/customError';
import {HTTPCode} from '../utils/enums';

@Service()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ((req as any).validated ?? req.query) as OrderListQueryDto;
      const orders = await this.orderService.list(query);

      res.status(200).json(BuildResponse.get(orders));
    } catch (error) {
      next(error);
    }
  }

  async findByContact(req: Request, res: Response, next: NextFunction) {
    try {
      const query = ((req as any).validated ?? req.query) as OrderSearchQueryDto;
      const orders = await this.orderService.findByContact(query);

      res.status(200).json(
        BuildResponse.get({
          data: orders,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

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

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(req.params.id, 'INVALID_ORDER_ID');
      const payload = ((req as any).validated ?? req.body) as UpdateOrderStatusDto;
      const order = await this.orderService.updateStatus(id, payload.status);

      res.status(200).json(
        BuildResponse.updated({
          data: order,
        }),
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  private parseId(idParam: string, errorCode: string): string {
    const id = idParam?.trim();

    if (!id) {
      throw new CustomError(HTTPCode.BAD_REQUEST, errorCode);
    }

    if (!uuidValidate(id) || uuidVersion(id) !== 4) {
      throw new CustomError(HTTPCode.BAD_REQUEST, errorCode);
    }

    return id;
  }
}

export default OrderController;
