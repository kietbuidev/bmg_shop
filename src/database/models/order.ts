import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, HasMany, HasOne, DeletedAt} from 'sequelize-typescript';

@Table({tableName: 'heyo_order'})
export default class Order extends Model<Order> {
  @AutoIncrement
  @PrimaryKey
  @Column({type: DataType.INTEGER.UNSIGNED, allowNull: false})
  declare id: number;

  @Column({type: DataType.BOOLEAN, allowNull: false})
  declare international: boolean;

  @Column({type: DataType.STRING(50), allowNull: false})
  declare provider_code: string;

  @Column({type: DataType.STRING(50), allowNull: false})
  declare sku: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare order_token: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare description: string;

  @Column({type: DataType.INTEGER.UNSIGNED, allowNull: true})
  declare post_id: number;

  @Column({type: DataType.SMALLINT.UNSIGNED, allowNull: true})
  declare number: number;

  @Column({type: DataType.INTEGER.UNSIGNED, allowNull: true})
  declare buyer: number;

  @Column({type: DataType.INTEGER.UNSIGNED, allowNull: true})
  declare owner: number;

  @Column({type: DataType.TEXT, allowNull: true})
  declare checkout_data: string;

  @Column({type: DataType.TEXT, allowNull: true})
  declare token_code: string;

  @Column({type: DataType.DECIMAL(15, 2), allowNull: true})
  declare tax_price: number;

  @Column({type: DataType.DECIMAL(15, 2), allowNull: true})
  declare subtotal: number;

  @Column({type: DataType.DECIMAL(15, 2), allowNull: true})
  declare extra_price: number;

  @Column({type: DataType.DECIMAL(15, 2), allowNull: true})
  declare payment_fee: number;

  @Column({type: DataType.DECIMAL(15, 2), allowNull: true})
  declare coupon_price: number;

  @Column({type: DataType.DECIMAL(15, 2), allowNull: true})
  declare discount_price: number;

  @Column({type: DataType.DECIMAL(15, 2), allowNull: true})
  declare base_total: number;

  @Column({type: DataType.DECIMAL(15, 2), allowNull: true})
  declare total: number;

  @Column({type: DataType.STRING(10), allowNull: true})
  declare currency: string;

  @Column({type: DataType.STRING(500), allowNull: true})
  declare commission: string;

  @Column({type: DataType.DATE, allowNull: true})
  declare start_date: Date | any;

  @Column({type: DataType.DATE, allowNull: true})
  declare end_date: Date | any;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare start_time: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare end_time: string;

  @Column({type: DataType.STRING(30), allowNull: true})
  declare post_type: string;

  @Column({type: DataType.STRING(50), allowNull: true})
  declare payment_status: string | any;

  @Column({type: DataType.STRING(100), allowNull: true})
  declare transaction_id: string;

  @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
  declare send_email: number;

  @Column({type: DataType.STRING(20), allowNull: true})
  declare payment_type: string | any;

  @Column({type: DataType.STRING(50), allowNull: true})
  declare payment_method: string;

  @Column({type: DataType.STRING(30), allowNull: true})
  declare status: string | any;

  @Column({type: DataType.STRING(3), allowNull: false, defaultValue: 'off'})
  declare rebook: string;

  @Column({type: DataType.BOOLEAN, allowNull: true, defaultValue: true})
  declare money_to_wallet: boolean;

  @Column({type: DataType.STRING(50), allowNull: true})
  declare first_name: string;

  @Column({type: DataType.STRING(50), allowNull: true})
  declare last_name: string;

  @Column({type: DataType.STRING(10), allowNull: true})
  declare title: string;

  @Column({type: DataType.STRING(100), allowNull: true})
  declare email: string;

  @Column({type: DataType.STRING(20), allowNull: true})
  declare phone: string;

  @Column({type: DataType.STRING(10), allowNull: true})
  phone_code: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare address: string;

  @Column({type: DataType.STRING(100), allowNull: true})
  declare city: string;

  @Column({type: DataType.STRING(10), allowNull: true})
  declare country: string;

  @Column({type: DataType.STRING(10), allowNull: true})
  declare postcode: string;

  @Column({type: DataType.STRING(500), allowNull: true})
  declare note: string;

  @Column({type: DataType.TEXT, allowNull: true})
  declare change_log: string;

  @Column({type: DataType.STRING(20), allowNull: true})
  declare check_in_time: string;

  @Column({type: DataType.STRING(20), allowNull: true})
  declare check_out_time: string;

  @Column({type: DataType.TEXT('long'), allowNull: true})
  declare refund_json: string;

  @Column({type: DataType.DATE, allowNull: true})
  declare expired_time: Date;

  @Column({type: DataType.STRING(5)})
  declare language: string;

  @Column({type: DataType.STRING(5), allowNull: true})
  declare sync_payment: string;

  // @Column({type: DataType.TEXT, allowNull: true})
  // declare payment_transactions: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date | null;

  // Vitual

  @Column({type: DataType.VIRTUAL, allowNull: true})
  number_night: number | null;

  @Column({type: DataType.VIRTUAL, allowNull: true})
  expired_booking: number | null;

  @Column({type: DataType.VIRTUAL, allowNull: true})
  quantity_status: number | null;

  @Column({type: DataType.VIRTUAL, allowNull: true})
  total_price: number | null;

  @Column({type: DataType.VIRTUAL, allowNull: true})
  flight_details: string | null | object;

  @Column({type: DataType.VIRTUAL, allowNull: true})
  declare payment_at: Date;

  // Relationship


}

Order.prototype.toJSON = function toJSON() {
  const values = {...this.get()};
  delete values.updated_at;

  return values;
};
