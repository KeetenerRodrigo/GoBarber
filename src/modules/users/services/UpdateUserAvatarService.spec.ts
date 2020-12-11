import 'reflect-metadata';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';

import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import { eachMonthOfInterval } from 'date-fns';

describe('UpdateUserAvatar', () => {
  it('should be able to update user avatar', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

    const user = await fakeUserRepository.create({
      name: 'Keetener Rodrigo',
      email: 'keetenermachado99@gmail.com',
      password: '123456'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    })

    expect(user.avatar).toBe('avatar.jpg')
  });

  it('should not be able to update avatar from none existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

    expect(updateUserAvatar.execute({
      user_id: 'none',
      avatarFilename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);

    const user = await fakeUserRepository.create({
      name: 'Keetener Rodrigo',
      email: 'keetenermachado99@gmail.com',
      password: '123456'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    })

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg'
    })

    expect(deleteFile).toHaveBeenCalledWith(
      'avatar.jpg'
    )
    expect(user.avatar).toBe('avatar2.jpg')
  });
});
