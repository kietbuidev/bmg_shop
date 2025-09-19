import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, HasMany, BelongsTo, HasOne, BelongsToMany} from 'sequelize-typescript';

@Table({tableName: 'heyo_media'})
export default class Media extends Model<Media> {
  @AutoIncrement
  @PrimaryKey
  @Column({type: DataType.BIGINT, allowNull: false})
  declare id: number;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare media_title: string | null;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare media_name: string;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare media_url: string;

  // @Column({type: DataType.STRING(255), allowNull: false})
  // media_path: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare media_description: string | null;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare media_size: string;

  @Column({type: DataType.STRING(50), allowNull: false})
  declare media_type: string;

  @Column({type: DataType.BIGINT, allowNull: false, defaultValue: 0})
  author: number;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;
}

Media.prototype.toJSON = function toJSON() {
  const values = {...this.get()};
  delete values.media_description;
  delete values.media_size;
  delete values.author;
  delete values.created_by;
  delete values.created_at;
  delete values.updated_by;
  delete values.updated_at;

  return values;
};
