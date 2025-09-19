import {Table, Column, Model, CreatedAt, UpdatedAt, DataType, AutoIncrement, PrimaryKey, Unique, HasOne} from 'sequelize-typescript';

@Table({tableName: 'users'})
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.BIGINT})
  declare id: number;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare first_name: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare last_name: string | null;

  @Unique
  @Column({type: DataType.STRING(128), allowNull: true})
  declare email: string;

  @Column({type: DataType.DATE, allowNull: true})
  declare email_verified_at: Date | null;

  @Column({type: DataType.STRING(20), allowNull: true})
  declare phone: string | null;

  @Column({type: DataType.STRING(10), allowNull: true})
  declare phone_code: string | null;

  @Column({type: DataType.STRING(10), allowNull: true})
  declare country: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare password: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare address: string | null;

  @Column({type: DataType.TEXT, allowNull: true})
  declare description: string | null;

  @Column({type: DataType.INTEGER, defaultValue: 0})
  declare request: number;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare request_date: string | null;

  @Column({type: DataType.INTEGER, allowNull: true, defaultValue: null})
  declare avatar: number | any;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare provider: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare provider_id: string | null;

  @Column({type: DataType.STRING(500), allowNull: true})
  declare payout: string | null;

  @Column({type: DataType.DATE, allowNull: true})
  declare last_check_notification: Date | null;

  @Column({type: DataType.STRING(50), allowNull: true})
  declare remember_token: string | null;

  @Column({type: DataType.TEXT, allowNull: true})
  declare device_token: string | null;

  @Column({type: DataType.TEXT, allowNull: true})
  declare fcm_token: string | null;

  @Column({type: DataType.STRING(3), allowNull: true})
  declare status: string | null;

  @Column({type: DataType.DATE, allowNull: true})
  declare birthday: Date | null;

  @Column({type: DataType.INTEGER, allowNull: true})
  declare title: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare linked: string | any;

  // @Column({type: DataType.STRING(255), allowNull: true})
  // declare apple_sub: string | null;

  // @Column({type: DataType.INTEGER, allowNull: true})
  // declare gender: string | null;

  // @Column({type: DataType.INTEGER, allowNull: true})
  // declare country: number | null;

  @Column({type: DataType.STRING(250), allowNull: true})
  declare refresh_token: string | null;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // Vitual

  // @Column({type: DataType.VIRTUAL, allowNull: true})
  // get full_name(): string {
  //   return `${this.getDataValue('first_name')} ${this.getDataValue('last_name')}`;
  // }

  @Column({type: DataType.VIRTUAL, allowNull: true})
  declare country_name: string | null;

  @Column({type: DataType.VIRTUAL, allowNull: true})
  declare title_name: string | null;

  @Column({type: DataType.VIRTUAL, allowNull: true, defaultValue: false})
  declare has_password: boolean;

  @Column({type: DataType.VIRTUAL, allowNull: true, defaultValue: false})
  declare tier: any;

  @Column({type: DataType.VIRTUAL, allowNull: true})
  declare language: string | null;

  // Relationship

}

User.prototype.toJSON = function toJSON() {
  const values = {...this.get()};
  delete values.password;
  // delete values.avatar;
  delete values.request;
  delete values.created_by;
  delete values.created_at;
  delete values.updated_by;
  delete values.updated_at;

  return values;
};
