import 'reflect-metadata';

import CreateUserService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    const user = await createUser.execute({
      email: 'teste@gmail.com',
      name: 'keetener',
      password: '145'
    })

    expect(user).toHaveProperty('id')
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    await createUser.execute({
      email: 'teste1@gmail.com',
      name: 'keetener',
      password: '12345678'
    })

    await expect(
      createUser.execute({
        email: 'teste1@gmail.com',
        name: 'keetener',
        password: '12345678'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
