import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, AfterFind} from 'sequelize-typescript';
import {translateModel} from '../../utils/language';
import {CustomFindOptions} from '../../utils/types';

@Table({tableName: 'heyo_language'})
export default class Language extends Model<Language> {
  @AutoIncrement
  @PrimaryKey
  @Column({type: DataType.BIGINT, allowNull: false})
  declare id: number;

  @Column({type: DataType.STRING(255), allowNull: false})
  declare code: string;

  @Column({type: DataType.TEXT, allowNull: true})
  declare name: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare flag_code: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare flag_name: string;

  @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
  declare priority: number;

  @Column({type: DataType.STRING(5), allowNull: false, defaultValue: 'no'})
  declare rtl: string;

  @Column({type: DataType.STRING(255), allowNull: true})
  declare status: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // Vitual
  @Column({type: DataType.VIRTUAL, allowNull: true})
  declare flag_icon: string | null;

  @AfterFind
  static afterFindHook(data: any, options: CustomFindOptions) {
    const translation = options.translation || null;
    if (translation && data) {
      translateModel(data, translation);
    }
  }
}

Language.prototype.toJSON = function toJSON() {
  const values = {...this.get()};
  delete values.created_by;
  delete values.updated_by;

  return values;
};
