import 'reflect-metadata';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(fakeUserRepository, fakeStorageProvider);
  });

  it('should be able to update user avatar', async () => {
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
    await expect(updateUserAvatar.execute({
      user_id: 'none',
      avatarFilename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
