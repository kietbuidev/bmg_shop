import {Service} from 'typedi';
import NotificationRepository from '../database/repositories/notification';
import UserRepository from '../database/repositories/user';
import Notification from '../database/models/notification';
import User from '../database/models/user';
import {NotificationType} from '../utils/enums';

interface BroadcastPayload {
  title: string;
  message: string;
  type: NotificationType | string;
  userFrom?: string | null;
  postId?: string | null;
}

@Service()
export class NotificationBroadcaster {
  private readonly notificationRepository: NotificationRepository;
  private readonly userRepository: UserRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.userRepository = new UserRepository();
  }

  private normaliseUserId(user: User): string | null {
    const idValue = user.id ?? null;
    if (!idValue) {
      return null;
    }
    return String(idValue);
  }

  async notifyAllUsers(payload: BroadcastPayload): Promise<Notification[]> {
    const users = await this.userRepository.findByOptions({attributes: ['id']});
    if (!users.length) {
      return [];
    }

    const notifications = users
      .map((user) => {
        const userId = this.normaliseUserId(user);
        if (!userId) {
          return null;
        }
        return {
          user_from: payload.userFrom ?? null,
          user_to: userId,
          title: payload.title,
          message: payload.message,
          type: payload.type,
          post_id: payload.postId ?? null,
        };
      })
      .filter((entry): entry is {
        user_from: string | null;
        user_to: string;
        title: string;
        message: string;
        type: string;
        post_id: string | null;
      } => Boolean(entry));

    if (!notifications.length) {
      return [];
    }

    return this.notificationRepository.bulkCreate(notifications);
  }
}

export default NotificationBroadcaster;
