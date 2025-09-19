import {Transaction} from 'sequelize';
import {BaseRepository} from './_base';
import Order from '../models/order';

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(Order);
  }

  async createWithTransaction(data: Partial<Order>, transaction: Transaction): Promise<Order> {
    return this.getModel().create(data as Order, {transaction});
  }
}

export default OrderRepository;
