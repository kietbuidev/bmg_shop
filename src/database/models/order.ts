import {
  Table, Column, Model, DataType, PrimaryKey, Default,
  CreatedAt, UpdatedAt, ForeignKey, BelongsTo, HasMany
} from 'sequelize-typescript';
import OrderItem from './order_item';
import Customer from './customer';

@Table({ tableName: 'orders', underscored: true })
export default class Order extends Model<Order> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING(32), allowNull: false, unique: true })
  declare order_code: string;

  @ForeignKey(() => Customer)
  @Column({ type: DataType.UUID, allowNull: false })
  declare customer_id: string;

  @BelongsTo(() => Customer, {foreignKey: 'customer_id', as: 'customer'})
  customer?: Customer;

  @Column({ type: DataType.STRING(32), allowNull: false, defaultValue: 'PENDING' })
  declare status: string;

  @Column({ type: DataType.STRING(8), allowNull: false, defaultValue: 'VND' })
  declare currency: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare total_items: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare subtotal_amount: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare discount_amount: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare total_amount: string;

  @CreatedAt declare created_at: Date;
  @UpdatedAt declare updated_at: Date;

  @HasMany(() => OrderItem, {foreignKey: 'order_id', as: 'items'})
  items?: OrderItem[];
}
