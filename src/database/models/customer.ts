import {
  Table, Column, Model, DataType, PrimaryKey, Default,
  CreatedAt, UpdatedAt, HasMany
} from 'sequelize-typescript';
import Order from './order';

@Table({ tableName: 'customers', underscored: true })
export default class Customer extends Model<Customer> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare full_name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.STRING(32), allowNull: true })
  declare phone: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare address: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare note: string | null;

  @CreatedAt declare created_at: Date;
  @UpdatedAt declare updated_at: Date;

  @HasMany(() => Order)
  orders?: Order[];
}