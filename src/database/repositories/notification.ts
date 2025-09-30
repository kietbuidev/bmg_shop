import NotificationModel from '../models/notification';
import {BaseRepository} from './_base';

export class NotificationRepository extends BaseRepository<NotificationModel> {
  constructor() {
    super(NotificationModel);
  }
}

export default NotificationRepository;
