import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPassowordEmailService from '../services/SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPassowordEmailService: SendForgotPassowordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPassowordEmailService = new SendForgotPassowordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );

  })

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'Keetener Rodrigo',
      email: 'keetenermachado99@gmail.com',
      password: '123456'
    })

    await sendForgotPassowordEmailService.execute({
      email: 'keetenermachado99@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(sendForgotPassowordEmailService.execute({
      email: 'keetenermachado99@gmail.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to recover the password using the email', async () => {
    const generateForgot = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUserRepository.create({
      name: 'Keetener Rodrigo',
      email: 'keetenermachado99@gmail.com',
      password: '123456'
    })

    await sendForgotPassowordEmailService.execute({
      email: 'keetenermachado99@gmail.com',
    });

    expect(generateForgot).toHaveBeenCalledWith(user.id);
  });

});
