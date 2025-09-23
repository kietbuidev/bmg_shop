import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, HasOne, ForeignKey, HasMany, BelongsTo, AfterFind, DeletedAt, Default} from 'sequelize-typescript';

@Table({tableName: 'posts'})
export default class Post extends Model<Post> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({type: DataType.TEXT, allowNull: false})
  declare post_title: string;

  @Column({type: DataType.TEXT, allowNull: false})
  declare post_slug: string;

  @Column({type: DataType.TEXT, allowNull: true})
  declare post_description: string;

  @Column({type: DataType.TEXT, allowNull: true})
  declare post_content: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare post_tag: string | any;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare thumbnail: string | null;

  @Column({type: DataType.JSONB, allowNull: false, defaultValue: []})
  declare gallery: any[];

  @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: true})
  declare is_active: boolean;

  @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
  declare is_popular: boolean;

  @Column({type: DataType.INTEGER, allowNull: false})
  declare priority: number;

  @Column({type: DataType.STRING(50), allowNull: true})
  declare status: string;

  // Vitual

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;

  // Relationship
}

Post.prototype.toJSON = function toJSON() {
  const values = {...this.get()};
  delete values.created_by;
  delete values.updated_by;
  delete values.updated_at;

  return values;
};
