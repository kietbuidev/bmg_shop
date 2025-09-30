import {Table, Column, Model, CreatedAt, UpdatedAt, DataType, AutoIncrement, PrimaryKey, Unique, HasOne, Default} from 'sequelize-typescript';

@Table({tableName: 'users'})
export default class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUIDV4})
  declare id: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare first_name: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare last_name: string | null;

  @Unique
  @Column({type: DataType.STRING(128), allowNull: true})
  declare email: string;

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

  @Column({type: DataType.INTEGER, allowNull: true, defaultValue: null})
  declare avatar: number | any;

  @Column({type: DataType.DATE, allowNull: true})
  declare last_check_notifcation: Date | null;

  @Column({type: DataType.STRING(3), allowNull: true})
  declare status: string | null;

  @Column({type: DataType.TEXT, allowNull: true})
  declare device_token: string | null;

  @Column({type: DataType.TEXT, allowNull: true})
  declare remember_token: string | null;

  @Column({type: DataType.TEXT, allowNull: true})
  declare refresh_token: string | null;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // Vitual

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
