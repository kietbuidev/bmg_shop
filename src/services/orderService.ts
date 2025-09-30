import {Service} from 'typedi';
import {Transaction, Op, WhereOptions, FindOptions} from 'sequelize';
import {randomUUID} from 'crypto';
import sequelize from '../database';
import Order from '../database/models/order';
import OrderItem from '../database/models/order_item';
import Product from '../database/models/product';
import Customer from '../database/models/customer';
import OrderRepository from '../database/repositories/order';
import CustomerRepository from '../database/repositories/customer';
import ProductRepository from '../database/repositories/product';
import {CreateOrderDto, CreateOrderItemDto, OrderListQueryDto} from '../database/models/dtos/orderDto';
import {CustomError, NotFoundError} from '../utils/customError';
import {HTTPCode, NotificationType} from '../utils/enums';
import {IPaginateResult} from '../utils/types';
import NotificationBroadcaster from './notificationBroadcaster';

interface CalculatedItem {
  product: Product;
  quantity: number;
  unitCurrency: string;
  unitRegular: number;
  unitPrice: number;
  unitDiscount: number;
  totalRegular: number;
  totalDiscount: number;
  totalPrice: number;
  payload: CreateOrderItemDto;
}

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const formatAmount = (value: number): string => {
  return value.toFixed(2);
};

const toNullableString = (value: string | null | undefined): string | null => {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const ORDER_STATUS_SET = new Set([
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'COMPLETED',
]);

@Service()
export class OrderService {
  private readonly orderRepository: OrderRepository;
  private readonly customerRepository: CustomerRepository;
  private readonly productRepository: ProductRepository;
  private readonly notificationBroadcaster: NotificationBroadcaster;

  constructor(notificationBroadcaster: NotificationBroadcaster) {
    this.orderRepository = new OrderRepository();
    this.customerRepository = new CustomerRepository();
    this.productRepository = new ProductRepository();
    this.notificationBroadcaster = notificationBroadcaster;
  }

  private generateOrderCode(): string {
    const now = new Date();

    const pad2 = (value: number) => value.toString().padStart(2, '0');

    const day = pad2(now.getDate());
    const year = pad2(now.getFullYear() % 100);
    const month = pad2(now.getMonth() + 1);
    const hours = pad2(now.getHours());
    const minutes = pad2(now.getMinutes());
    const seconds = pad2(now.getSeconds());

    return `${day}${year}${month}-BMG-${hours}${minutes}${seconds}`;
  }

  private async resolveCustomer(data: CreateOrderDto['customer'], transaction: Transaction): Promise<Customer> {
    const model = this.customerRepository.getModel();

    const where: any[] = [];
    if (data.email) {
      where.push({email: data.email});
    }
    if (data.phone) {
      where.push({phone: data.phone});
    }

    let customer: Customer | null = null;
    if (where.length > 0) {
      customer = await model.findOne({
        where: {[Op.or]: where},
        transaction,
      });
    }

    if (customer) {
      customer.full_name = data.full_name;
      customer.email = data.email ?? null;
      customer.phone = data.phone ?? null;
      customer.address = data.address ?? null;
      customer.note = data.note ?? null;
      await customer.save({transaction});
      return customer;
    }

    return model.create(
      {
        full_name: data.full_name,
        email: data.email ?? null,
        phone: data.phone ?? null,
        address: data.address ?? null,
        note: data.note ?? null,
      },
      {transaction},
    );
  }

  private async resolveProducts(items: CreateOrderItemDto[], transaction: Transaction): Promise<Map<string, Product>> {
    const productIds = items.map((item) => item.product_id);
    const uniqueIds = [...new Set(productIds)];

    const products = await this.productRepository
      .getModel()
      .scope('withInactive')
      .findAll({
        where: {id: uniqueIds},
        transaction,
      });

    const productMap = new Map<string, Product>();
    products.forEach((product) => productMap.set(product.id, product));
    return productMap;
  }

  private calculateItems(items: CreateOrderItemDto[], products: Map<string, Product>): CalculatedItem[] {
    return items.map((item) => {
      const product = products.get(item.product_id);
      if (!product) {
        throw new CustomError(HTTPCode.BAD_REQUEST, 'ORDER_PRODUCT_NOT_FOUND', {product_id: item.product_id});
      }

      const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
      const regular = toNumber(product.regular_price);
      const sale = toNumber(product.sale_price);
      const price = sale > 0 ? sale : regular;
      const currency = product.currency ?? 'VND';

      const discount = Math.max(regular - price, 0);

      return {
        product,
        quantity,
        unitCurrency: currency,
        unitRegular: regular,
        unitPrice: price,
        unitDiscount: discount,
        totalRegular: regular * quantity,
        totalDiscount: discount * quantity,
        totalPrice: price * quantity,
        payload: item,
      };
    });
  }

  async create(payload: CreateOrderDto): Promise<Order> {
    if (!payload.items || payload.items.length === 0) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'ORDER_ITEMS_REQUIRED');
    }

    const order = await sequelize.transaction(async (transaction) => {
      const customer = await this.resolveCustomer(payload.customer, transaction);
      const productMap = await this.resolveProducts(payload.items, transaction);
      const calculated = this.calculateItems(payload.items, productMap);

      const totalItems = calculated.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = calculated.reduce((sum, item) => sum + item.totalRegular, 0);
      const totalDiscount = calculated.reduce((sum, item) => sum + item.totalDiscount, 0);
      const totalAmount = calculated.reduce((sum, item) => sum + item.totalPrice, 0);

      const currencySet = new Set<string>(calculated.map((item) => item.unitCurrency));
      if (currencySet.size > 1) {
        throw new CustomError(HTTPCode.BAD_REQUEST, 'ORDER_CURRENCY_MISMATCH');
      }

      const order = await this.orderRepository.createWithTransaction(
        {
          order_code: this.generateOrderCode(),
          customer_id: customer.id,
          status: 'PENDING',
          currency: calculated[0]?.unitCurrency ?? 'VND',
          total_items: totalItems,
          subtotal_amount: formatAmount(subtotal),
          discount_amount: formatAmount(totalDiscount),
          total_amount: formatAmount(totalAmount),
        },
        transaction,
      );

      const orderItemsPayload = calculated.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_code: item.product.code,
        product_name: item.product.name,
        product_thumbnail: item.product.thumbnail ?? null,
        selected_size: toNullableString(item.payload.selected_size),
        selected_color: toNullableString(item.payload.selected_color),
        unit_currency: item.unitCurrency,
        unit_price: formatAmount(item.unitRegular),
        unit_discount_value: formatAmount(item.unitDiscount),
        unit_discounted_price: formatAmount(item.unitPrice),
        quantity: item.quantity,
      }));

      await OrderItem.bulkCreate(orderItemsPayload, {transaction});

      await order.reload({
        include: [
          {model: Customer, as: 'customer'},
          {model: OrderItem, as: 'items'},
        ],
        transaction,
      });

      return order;
    });

    await this.notificationBroadcaster.notifyAllUsers({
      title: 'Đơn hàng mới',
      message: `Đơn hàng ${order.order_code} vừa được tạo với tổng tiền ${order.total_amount}.`,
      type: NotificationType.ORDER,
    });

    return order;
  }

  async list(query: OrderListQueryDto): Promise<IPaginateResult<Order>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const requestedStatus = typeof query.status === 'string' ? query.status.trim().toUpperCase() : undefined;

    const where: WhereOptions<Order> = {};
    if (requestedStatus && requestedStatus !== 'ALL') {
      where.status = requestedStatus;
    }

    const options: FindOptions = {
      where,
      include: [
        {model: Customer, as: 'customer'},
        {model: OrderItem, as: 'items'},
      ],
      order: [['created_at', 'DESC']],
    };

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const offset = pageNumber > 1 ? (pageNumber - 1) * limitNumber : 0;

    const model = this.orderRepository.getModel();
    const [rows, total] = await Promise.all([
      model.findAll({
        ...options,
        offset,
        limit: limitNumber,
        subQuery: false,
      }),
      model.count({where}),
    ]);

    const totalPage = Math.ceil(total / limitNumber || 1);

    return {
      pagination: {
        total_page: totalPage,
        per_page: limitNumber,
        current_page: pageNumber,
        count: total,
      },
      rows: rows as Order[],
    };
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const normalizedStatus = status.trim().toUpperCase();

    if (!ORDER_STATUS_SET.has(normalizedStatus)) {
      throw new CustomError(HTTPCode.BAD_REQUEST, 'ORDER_STATUS_INVALID');
    }

    const order = await this.orderRepository.getById(id, {
      include: [
        {model: Customer, as: 'customer'},
        {model: OrderItem, as: 'items'},
      ],
    });

    if (!order) {
      throw new NotFoundError('ORDER_NOT_FOUND');
    }

    order.status = normalizedStatus;
    await order.save();
    await order.reload({
      include: [
        {model: Customer, as: 'customer'},
        {model: OrderItem, as: 'items'},
      ],
    });

    return order;
  }
}

export default OrderService;
