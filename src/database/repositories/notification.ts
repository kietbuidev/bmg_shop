import Notification from '../models/notification';
import {BaseRepository} from './_base';

export class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super(Notification);
  }
}

export default NotificationRepository;
