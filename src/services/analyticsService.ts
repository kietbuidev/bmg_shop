import {Service} from 'typedi';
import {Model, ModelStatic, fn, col} from 'sequelize';
import OrderRepository from '../database/repositories/order';
import ProductRepository from '../database/repositories/product';
import PostRepository from '../database/repositories/post';
import ContactRepository from '../database/repositories/contact';
import {ContactStatus, OrderStatus, ProductStatus} from '../utils/enums';

type EnumValue<E> = E[keyof E];

type OrderStatusValue = EnumValue<typeof OrderStatus>;
type ProductStatusValue = EnumValue<typeof ProductStatus>;
type ContactStatusValue = EnumValue<typeof ContactStatus>;

interface ComputedAnalytics<Status extends string> {
  total: number;
  status_breakdown: Record<Status, number>;
}

export interface OrderAnalyticsResult {
  total_orders: number;
  status_breakdown: Record<OrderStatusValue, number>;
}

export interface ProductAnalyticsResult {
  total_products: number;
  status_breakdown: Record<ProductStatusValue, number>;
}

export interface PostAnalyticsResult {
  total_posts: number;
  is_active_breakdown: {
    active: number;
    inactive: number;
  };
}

export interface ContactAnalyticsResult {
  total_contacts: number;
  status_breakdown: Record<ContactStatusValue, number>;
}

@Service()
export class AnalyticsService {
  private readonly orderRepository: OrderRepository;
  private readonly productRepository: ProductRepository;
  private readonly postRepository: PostRepository;
  private readonly contactRepository: ContactRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
    this.postRepository = new PostRepository();
    this.contactRepository = new ContactRepository();
  }

  private async computeStatusAnalytics<T extends Model, Status extends string>(
    model: ModelStatic<T>,
    field: string,
    statuses: readonly Status[],
  ): Promise<ComputedAnalytics<Status>> {
    const baseModel = (model as any).unscoped ? (model as any).unscoped() : model;

    const total = await baseModel.count();

    const breakdown = statuses.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<Status, number>);

    const normalizedStatuses = statuses.map((status) => ({
      original: status,
      normalized: status.toString().toUpperCase(),
    }));

    const rows = (await baseModel.findAll({
      attributes: [[fn('COUNT', col('*')), 'count'], field],
      group: [field],
      order: [],
      raw: true,
    })) as Array<Record<string, unknown>>;

    let knownTotal = 0;

    rows.forEach((row) => {
      const countValue = Number(row.count ?? 0);
      if (!Number.isFinite(countValue)) {
        return;
      }

      const rawValue = row[field];
      if (typeof rawValue !== 'string') {
        return;
      }

      const normalizedValue = rawValue.trim().toUpperCase();
      const match = normalizedStatuses.find((status) => status.normalized === normalizedValue);

      if (match) {
        breakdown[match.original] = countValue;
        knownTotal += countValue;
      }
    });

    const unknown = Math.max(total - knownTotal, 0);

    return {
      total,
      status_breakdown: breakdown,
    };
  }

  private async computeBooleanAnalytics<T extends Model>(
    model: ModelStatic<T>,
    field: string,
  ): Promise<{total: number; active: number; inactive: number}> {
    const baseModel = (model as any).unscoped ? (model as any).unscoped() : model;

    const [total, active, inactive] = await Promise.all([
      baseModel.count(),
      baseModel.count({where: {[field]: true}} as any),
      baseModel.count({where: {[field]: false}} as any),
    ]);

    const known = active + inactive;

    return {
      total,
      active,
      inactive,
    };
  }

  public async getOrderAnalytics(): Promise<OrderAnalyticsResult> {
    const result = await this.computeStatusAnalytics(
      this.orderRepository.getModel(),
      'status',
      Object.values(OrderStatus) as OrderStatusValue[],
    );

    return {
      total_orders: result.total,
      status_breakdown: result.status_breakdown,
    };
  }

  public async getProductAnalytics(): Promise<ProductAnalyticsResult> {
    const result = await this.computeStatusAnalytics(
      this.productRepository.getModel(),
      'status',
      Object.values(ProductStatus) as ProductStatusValue[],
    );

    return {
      total_products: result.total,
      status_breakdown: result.status_breakdown,
    };
  }

  public async getPostAnalytics(): Promise<PostAnalyticsResult> {
    const result = await this.computeBooleanAnalytics(this.postRepository.getModel(), 'is_active');

    return {
      total_posts: result.total,
      is_active_breakdown: {
        active: result.active,
        inactive: result.inactive,
      }
    };
  }

  public async getContactAnalytics(): Promise<ContactAnalyticsResult> {
    const result = await this.computeStatusAnalytics(
      this.contactRepository.getModel(),
      'status',
      Object.values(ContactStatus) as ContactStatusValue[],
    );

    return {
      total_contacts: result.total,
      status_breakdown: result.status_breakdown,
    };
  }
}

export default AnalyticsService;
