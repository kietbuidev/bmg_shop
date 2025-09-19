// models/table_counter.ts
import {
  Table, Column, Model, DataType, PrimaryKey, Default,
  CreatedAt, UpdatedAt
} from 'sequelize-typescript';

@Table({ tableName: 'counter', underscored: true })
export default class Counter extends Model<Counter> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING(39), allowNull: false, defaultValue: '0.0.0.0' })
  declare ip: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare os: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare browser: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare device: string | null;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}