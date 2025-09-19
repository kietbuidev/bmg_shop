// import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, HasOne, ForeignKey, HasMany, BelongsTo, AfterFind, DeletedAt} from 'sequelize-typescript';
// import Media from './media';
// import {CustomFindOptions} from '../../utils/types';
// import {getTranslate, translateModel} from '../../utils/language';

// @Table({tableName: 'heyo_post'})
// export default class Post extends Model<Post> {
//   @PrimaryKey
//   @AutoIncrement
//   @Column({type: DataType.BIGINT.UNSIGNED})
//   declare id: number;

//   @Column({type: DataType.TEXT, allowNull: false})
//   declare post_title: string;

//   @Column({type: DataType.TEXT, allowNull: false})
//   declare post_slug: string;

//   @Column({type: DataType.TEXT, allowNull: true})
//   declare post_description: string;

//   @Column({type: DataType.TEXT('long'), allowNull: true})
//   declare post_content: string;

//   @Column({type: DataType.TEXT('long'), allowNull: true})
//   declare table_of_content: string;

//   @Column({type: DataType.STRING(255), allowNull: true})
//   declare post_category: string | any;

//   @Column({type: DataType.STRING(255), allowNull: true})
//   declare post_tag: string | any;

//   @Column({type: DataType.STRING(255), allowNull: true})
//   declare location_city: string;

//   @Column({type: DataType.STRING(255), allowNull: true})
//   declare location_country: string;

//   @Column({type: DataType.INTEGER, allowNull: true})
//   declare reading_time: number;

//   @ForeignKey(() => Media)
//   @Column({type: DataType.BIGINT, allowNull: true})
//   declare thumbnail_id: string;

//   @Column({type: DataType.STRING(50), allowNull: true})
//   declare status: string;

//   @Column({type: DataType.INTEGER, allowNull: false})
//   declare priority: number;

//   @Column({type: DataType.BIGINT, allowNull: false, defaultValue: 0})
//   declare author: bigint;

//   @Column({type: DataType.INTEGER, allowNull: true, defaultValue: 0})
//   declare like_count: number;

//   @Column({type: DataType.TEXT('long'), allowNull: true})
//   declare social_json: string;

//   // Vitual
//   @Column({type: DataType.VIRTUAL, allowNull: true})
//   declare location_city_name: string;

//   @Column({type: DataType.VIRTUAL, allowNull: true})
//   declare location_city_country: string;

//   @CreatedAt
//   declare created_at: Date;

//   @UpdatedAt
//   declare updated_at: Date;

//   @DeletedAt
//   declare deleted_at: Date;

//   // Relationship
//   @HasOne(() => Media, {foreignKey: 'id', sourceKey: 'thumbnail_id'})
//   media: Media;

//   @AfterFind
//   static afterFindHook(data: Post, options: CustomFindOptions) {
//     const translation = options.translation || null;
//     if (translation && data) {
//       translateModel(data, translation);
//     }
//   }
// }

// Post.prototype.toJSON = function toJSON() {
//   const values = {...this.get()};
//   delete values.created_by;
//   // delete values.created_at;
//   delete values.updated_by;
//   delete values.updated_at;

//   return values;
// };
