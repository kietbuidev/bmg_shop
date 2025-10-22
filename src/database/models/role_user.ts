import {Table, Column, Model, DataType, CreatedAt, UpdatedAt, AutoIncrement, PrimaryKey, Default, ForeignKey, BelongsTo} from 'sequelize-typescript';
import User from './user';
import Role from './role';

@Table({tableName: 'role_user', underscored: true})
export default class RoleUser extends Model<RoleUser> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUIDV4})
  declare id: string;

  @ForeignKey(() => User)
  @Column({allowNull: false, type: DataType.UUID})
  declare user_id: string;

  @ForeignKey(() => Role)
  @Column({allowNull: false, type: DataType.INTEGER})
  declare role_id: number;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => Role)
  role?: Role;
}
