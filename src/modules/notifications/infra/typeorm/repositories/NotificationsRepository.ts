import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationsDTO from '@modules/notifications/dtos/ICreateNotificationsDTO';
import Notification from "../schemas/Notification";

class NotificationRepository implements INotificationsRepository {
  private ormNotification: MongoRepository<Notification>

  constructor() {
    this.ormNotification = getMongoRepository(Notification, 'mongo');
  }

  public async create({ content, recipient_id }: ICreateNotificationsDTO): Promise<Notification> {
    const notification = await this.ormNotification.create({
      content,
      recipient_id
    })

    await this.ormNotification.save(notification);

    return notification;
  }
}

export default NotificationRepository;
