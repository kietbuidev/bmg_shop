import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, HasOne, ForeignKey, HasMany, BelongsTo, AfterFind, DeletedAt, Default} from 'sequelize-typescript';

@Table({tableName: 'districts'})
export default class District extends Model<District> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({type: DataType.UUID, allowNull: false})
  declare province_id: string;

  @Column({type: DataType.TEXT, allowNull: false})
  declare name: string;

  @Column({type: DataType.TEXT, allowNull: true})
  declare description: string;

  @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: true})
  declare is_deleted: boolean;

  // Vitual

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}

District.prototype.toJSON = function toJSON() {
  const values = {...this.get()};
  delete values.updated_at;

  return values;
};
