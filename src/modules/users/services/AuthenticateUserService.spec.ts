import 'reflect-metadata';

import AuthenticateUserService from './AuthenticateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';


import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);
    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    await createUser.execute({
      name: 'keetener',
      email: 'teste@gmail.com',
      password: '12345678'
    })

    const response = await authenticateUser.execute({
      email: 'teste@gmail.com',
      password: '12345678'
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toHaveProperty('token')
  });
});