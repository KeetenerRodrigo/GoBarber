import 'reflect-metadata';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('CreateUser', () => {

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'keetener',
      email: 'teste@gmail.com',
      password: '145'
    });

    const profile = await showProfileService.execute({
      user_id: user.id
    });

    expect(profile.name).toBe('keetener');
    expect(profile.email).toBe('teste@gmail.com');
  });

  it('should not be able show the profile from non-existing user', async () => {
    await expect(showProfileService.execute({
      user_id: 'non-existing-user-id',
    })).rejects.toBeInstanceOf(AppError);
  });
});
