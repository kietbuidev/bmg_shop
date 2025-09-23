import {Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt, DefaultScope, Default, Scopes} from 'sequelize-typescript';
import Category from './category';

@DefaultScope(() => ({
  where: {is_active: true},
  order: [
    ['priority', 'DESC'],
    ['name', 'ASC'],
  ],
}))
@Scopes(() => ({
  withInactive: {},
  byCategory: (categoryId: string | null) => ({where: {category_id: categoryId}}),
  bySlug: (slug: string) => ({where: {slug}}),
}))
@Table({tableName: 'products', paranoid: true, underscored: true})
export default class Product extends Model<Product> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUIDV4})
  declare id: string;

  @ForeignKey(() => Category)
  @Column({type: DataType.UUIDV4, allowNull: true})
  declare category_id: string | null;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare name: string;

  @Column({type: DataType.STRING(64), allowNull: false, unique: true})
  declare code: string;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare slug: string;

  @Column({type: DataType.TEXT, allowNull: true})
  declare description: string | null;

  @Column({type: DataType.TEXT, allowNull: true})
  declare short_description: string | null;

  @Column({type: DataType.TEXT, allowNull: true})
  declare content: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare thumbnail: string | null;

  @Column({type: DataType.JSONB, allowNull: false, defaultValue: []})
  declare gallery: any[];

  @Column({type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0})
  declare regular_price: string;

  @Column({type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0})
  declare sale_price: string;

  @Column({type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0})
  declare percent: string;

  @Column({type: DataType.STRING(8), allowNull: false, defaultValue: 'VND'})
  declare currency: string;

  @Column({type: DataType.JSONB, allowNull: false, defaultValue: []})
  declare sizes: (number | string)[];

  @Column({type: DataType.JSONB, allowNull: false, defaultValue: []})
  declare colors: (number | string)[];

  @Column({type: DataType.BIGINT, allowNull: false, defaultValue: 0})
  declare view_count: number;

  @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: true})
  declare is_active: boolean;

  @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
  declare is_popular: boolean;

  @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
  declare priority: number;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare meta_title: string | null;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare meta_keyword: string | null;

  @Column({type: DataType.TEXT, allowNull: true})
  declare meta_description: string | null;

  @CreatedAt
  declare created_at: Date;
  @UpdatedAt
  declare updated_at: Date;
  @DeletedAt
  declare deleted_at: Date | null;

  // Relationship
  @BelongsTo(() => Category, {foreignKey: 'category_id'})
  category?: Category;
}
