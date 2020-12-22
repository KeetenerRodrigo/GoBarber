import 'reflect-metadata';

import AuthenticateUserService from './AuthenticateUserService';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';


import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(fakeUserRepository, fakeHashProvider);
    createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);
  })


  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'keetener',
      email: 'teste@gmail.com',
      password: '12345678'
    })

    const response = await authenticateUser.execute({
      email: 'teste@gmail.com',
      password: '12345678'
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(authenticateUser.execute({
      email: 'teste@gmail.com',
      password: '12345678'
    })).rejects.toBeInstanceOf(AppError)
  });

  it('should be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'keetener',
      email: 'teste@gmail.com',
      password: '12345678'
    })

    await expect(authenticateUser.execute({
      email: 'teste@gmail.com',
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(AppError)
  });
});
