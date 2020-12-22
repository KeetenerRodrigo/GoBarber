import 'reflect-metadata';

import CreateUserService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  })

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      email: 'teste@gmail.com',
      name: 'keetener',
      password: '145'
    })

    expect(user).toHaveProperty('id')
  });

  it('should not be able to create a new user with same email from another', async () => {
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
