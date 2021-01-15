import 'reflect-metadata';

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '../../notifications/repositories/fakes/FakeNotificationsRepository';

import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository, fakeNotificationsRepository);
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 14, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 0, 14, 13),
      user_id: 'user-id',
      providerId: 'provider-id',
    })

    expect(appointment).toHaveProperty('id'),
    expect(appointment.providerId).toBe('provider-id')
  });

  it('should not be able to create two appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 14, 12).getTime();
    });

    const appointmentDate = new Date(2021, 0, 14, 13);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'user-id',
      providerId: 'provider-id',
    })

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'user-id',
        providerId: 'provider-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });


  it('should not be able to create an apointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 14, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 14, 11),
        user_id: 'user-id',
        providerId: 'provider-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an apointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 14, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 14, 13),
        user_id: 'user-id',
        providerId: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });


  it('should not be able to create an apointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 14, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 14, 7),
        user_id: 'user-id',
        providerId: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 14, 18),
        user_id: 'user-id',
        providerId: 'user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
