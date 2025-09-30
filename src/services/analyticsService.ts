import {Service} from 'typedi';
import OrderRepository from '../database/repositories/order';
import {OrderStatus} from '../utils/enums';

type OrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderAnalyticsResult {
  total_orders: number;
  status_breakdown: Record<OrderStatusValue, number>;
}

@Service()
export class AnalyticsService {
  private readonly orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  public async getOrderAnalytics(): Promise<OrderAnalyticsResult> {
    const model = this.orderRepository.getModel();
    const totalOrders = await model.count();

    const statusValues = Object.values(OrderStatus);
    const statusBreakdown = statusValues.reduce((acc, status) => {
      acc[status as OrderStatusValue] = 0;
      return acc;
    }, {} as Record<OrderStatusValue, number>);

    await Promise.all(
      statusValues.map(async (status) => {
        const count = await model.count({where: {status}});
        statusBreakdown[status as OrderStatusValue] = count;
      }),
    );

    const knownStatusTotal = statusValues.reduce((sum, status) => sum + statusBreakdown[status as OrderStatusValue], 0);

    return {
      total_orders: totalOrders,
      status_breakdown: statusBreakdown,
    };
  }
}

export default AnalyticsService;
