import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import { getAbsoluteMappingEntries } from 'tsconfig-paths/lib/mapping-entry';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  })

  it('should be able to reset the password', async () => {
    let user = await fakeUserRepository.create({
      name: 'Keetener Rodrigo',
      email: 'keetenermachado99@gmail.com',
      password: '123456'
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '654321',
      token: userToken.token
    });

    const updateuser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('654321');
    expect(updateuser?.password).toBe('654321');
  });

  it('should not be able to reset password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '654321'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('non-existing-user');

    await expect(
      resetPasswordService.execute({
        token,
        password: '654321'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passe more than 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'Keetener Rodrigo',
      email: 'keetenermachado99@gmail.com',
      password: '123456'
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(resetPasswordService.execute({
      password: '654321',
      token
    })).rejects.toBeInstanceOf(AppError);
  });
});
