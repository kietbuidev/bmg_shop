// models/category.ts
import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey,
  BelongsTo, HasMany, CreatedAt, UpdatedAt, DeletedAt, DefaultScope, Scopes, AfterFind
} from 'sequelize-typescript';
import Media from './media';
import { CustomFindOptions } from '../../utils/types';
import { translateModel } from '../../utils/language';

@DefaultScope(() => ({
  where: { is_active: true },
  order: [['priority', 'DESC'], ['name', 'ASC']],
}))
@Scopes(() => ({
  withInactive: {},
  byParent: (parentId: number | null) => ({ where: { parent_id: parentId } }),
  bySlug: (slug: string) => ({ where: { slug } }),
}))

@Table({ tableName: 'categories', paranoid: true, underscored: true })
export default class Category extends Model<Category> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.UUIDV4 })
  declare id: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @ForeignKey(() => Category)
  @Column({ type: DataType.UUIDV4, allowNull: true })
  declare parent_id: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare thumbnail_id: string | null;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
  declare gallery: any[];

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare is_active: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare is_popular: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare priority: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare meta_title: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare meta_keyword: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare meta_description: string | null;

  @CreatedAt declare created_at: Date;
  @UpdatedAt declare updated_at: Date;
  @DeletedAt declare deleted_at: Date | null;

  // Relationships
  @BelongsTo(() => Category, { foreignKey: 'parent_id', constraints: true })
  parent?: Category;

  @HasMany(() => Category, 'parent_id')
  children?: Category[];

  @BelongsTo(() => Media, { foreignKey: 'thumbnail_id', constraints: true })
  thumbnail?: Media;

  @AfterFind
  static afterFindHook(data: Category | Category[] | null, options: CustomFindOptions) {
    if (!data) return;
    const translation = (options as any)?.translation || null;
    if (!translation) return;
    if (Array.isArray(data)) data.forEach((d) => translateModel(d as any, translation));
    else translateModel(data as any, translation);
  }
}