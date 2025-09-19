// import {OrderChangeLogRepository} from './order_change_log';
// import {BaseRepository} from './_base';
// import Order from '../models/order';
// import {sequelize} from '../models';

// export class OrderRepository extends BaseRepository<Order> {
//   private OrderChangeLogRepository: OrderChangeLogRepository;

//   constructor() {
//     super(Order);

//     this.OrderChangeLogRepository = new OrderChangeLogRepository();
//   }

//   async appendChangeLog(id: number, action: string, user: string = 'System') {
//     const args = {
//       user: user,
//       action: action,
//       create: Date.now(),
//     };

//     // const data = JSON.stringify(args) + ',';
//     // await sequelize.query('UPDATE `heyo_order` SET `change_log` = concat(ifnull(`change_log`,""),?) WHERE `id` =?', [data, id]);
//     const data = JSON.stringify(args) + ',';
//     const query = 'UPDATE `heyo_order` SET `change_log` = concat(ifnull(`change_log`,""),?) WHERE `id` = ?';
//     await sequelize.query(query, {
//       replacements: [data, id],
//       // type: sequelize.QueryTypes.RAW
//     });

//     // await this.OrderChangeLogRepository.create({
//     //   order_id: id,
//     //   user: user,
//     //   action: action,
//     // });
//   }
// }

// export default OrderRepository;
