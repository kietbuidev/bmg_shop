import { Column, CreatedAt, UpdatedAt, DataType} from 'sequelize-typescript';

export class BaseEntity {
  @Column({type: DataType.INTEGER, allowNull: true})
  declare created_by: number;

  @Column({type: DataType.INTEGER, allowNull: true})
  declare updated_by: number;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // public translate(data: any, fields: string[], language: string) {
  //   if(translation && data) {
  //     if (Array.isArray(data)) {
  //       data.forEach((result) => {
  //         for(let field of fields) {
  //           if(result[field]) {
  //             result[field] = getTranslate(result[field], language);
  //           }
  //         }

  //       });
  //     } else {
  //       for(let field of fields) {
  //         if(data[field]) {
  //           data[field] = getTranslate(data[field], language);
  //         }
  //       }
  //     }
  //   }
  // }
}
