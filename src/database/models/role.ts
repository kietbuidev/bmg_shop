import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, Default, BelongsToMany} from 'sequelize-typescript';
import User from './user';
import RoleUser from './role_user';

@Table({tableName: 'roles', underscored: true})
export default class Role extends Model<Role> {
  @PrimaryKey
  @AutoIncrement
  @Column({type: DataType.INTEGER})
  declare id: number;

  @Column({allowNull: false, type: DataType.TEXT})
  declare name: string;

  @Column({allowNull: false, type: DataType.TEXT})
  declare description: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @BelongsToMany(() => User, {through: () => RoleUser, as: 'users', foreignKey: 'role_id', otherKey: 'user_id'})
  users?: User[];
}
