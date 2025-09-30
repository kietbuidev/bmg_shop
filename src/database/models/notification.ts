import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, HasOne, Default} from 'sequelize-typescript';
import Order from './order';

@Table({tableName: 'notification'})
export default class Notification extends Model<Notification> {
   @PrimaryKey
   @Default(DataType.UUIDV4)
   @Column(DataType.UUID)
   declare id: string;

  @Column({type: DataType.STRING(64), allowNull: true})
  declare user_from: string | null;

  @Column({type: DataType.STRING(64), allowNull: false})
  declare user_to: string;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare title: string;

  @Column({type: DataType.TEXT, allowNull: false})
  declare message: string;

  @Column({type: DataType.STRING(50), allowNull: false})
  declare type: string;

  @Column({type: DataType.STRING(64), allowNull: true})
  declare post_id: string | null;

  // Virtual
  @Column({type: DataType.VIRTUAL, allowNull: true, defaultValue: false})
  declare is_new: boolean;


  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // Relationship
  @HasOne(() => Order, {foreignKey: 'id', sourceKey: 'post_id'})
  order: Order;

}
