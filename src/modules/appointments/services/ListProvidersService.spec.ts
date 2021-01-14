import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import ListProvidersService from './ListProvidersService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let fakeUserRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProvider', () => {

  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    listProvidersService = new ListProvidersService(fakeUserRepository);
  });

  it('should be able to list the provider', async () => {
    const fakeUser1 = await fakeUserRepository.create({
      name: 'Keetener Rodrigo',
      email: 'keetener@gmail.com',
      password: '12345678'
    });

    const fakeUser2 = await fakeUserRepository.create({
      name: 'Maria Eduarda',
      email: 'maria@gmail.com',
      password: '12345678'
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'Rita',
      email: 'rita@gmail.com',
      password: '12345678'
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id
    });

    expect(providers).toEqual([
      fakeUser1,
      fakeUser2
    ]);
  });
});
