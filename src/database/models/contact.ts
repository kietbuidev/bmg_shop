import {Table, Column, Model, CreatedAt, UpdatedAt, DataType, AutoIncrement, PrimaryKey} from 'sequelize-typescript';

@Table({tableName: 'heyo_contact'})
export default class Contact extends Model<Contact> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.BIGINT.UNSIGNED})
  declare id: number;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare full_name: string | null;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare phone: string | null;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare email_from: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare email_to: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare subject: string;

  @Column({type: DataType.TEXT, allowNull: true})
  declare message: string | null;

  @Column({type: DataType.TEXT('long'), allowNull: true})
  declare attached_files: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare topic: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare order_id: number | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare status: string | null;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}

Contact.prototype.toJSON = function toJSON() {
  const values = {...this.get()};
  delete values.created_by;
  delete values.updated_by;

  return values;
};
