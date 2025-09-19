import {
  Table, Column, Model, DataType,
  PrimaryKey, Default, CreatedAt, UpdatedAt
} from 'sequelize-typescript';

@Table({ tableName: 'contacts', underscored: true })
export default class Contact extends Model<Contact> {
  @PrimaryKey @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare full_name: string;

  @Column({ type: DataType.STRING(32), allowNull: true })
  declare phone: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare address: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare email: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare subject: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare message: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare attachment: string | null;

  @Column({ type: DataType.STRING(50), allowNull: true})
  declare status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare note: string | null;

  @CreatedAt declare created_at: Date;
  @UpdatedAt declare updated_at: Date;
}