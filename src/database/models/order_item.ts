import {
  Table, Column, Model, DataType, PrimaryKey, Default,
  CreatedAt, UpdatedAt, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import Order from './order';
import Product from './product';

@Table({ tableName: 'order_items', underscored: true })
export default class OrderItem extends Model<OrderItem> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false })
  declare order_id: string;

  @BelongsTo(() => Order, {as: 'order', foreignKey: 'order_id'})
  order?: Order;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false })
  declare product_id: string;

  @BelongsTo(() => Product, {as: 'product', foreignKey: 'product_id'})
  product?: Product;

  @Column({ type: DataType.STRING(64), allowNull: false })
  declare product_code: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare product_name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare product_thumbnail_id: string | null;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  declare product_sizes: unknown[];

  @Column({ type: DataType.TEXT, allowNull: true })
  declare selected_size: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare selected_color: string | null;

  @Column({ type: DataType.STRING(8), allowNull: false, defaultValue: 'VND' })
  declare unit_currency: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare unit_price: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare unit_discount_value: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare unit_discounted_price: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  declare quantity: number;

  @CreatedAt declare created_at: Date;
  @UpdatedAt declare updated_at: Date;
}
