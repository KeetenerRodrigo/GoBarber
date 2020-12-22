import 'reflect-metadata';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      providerId: '565656565',
    })

    expect(appointment).toHaveProperty('id'),
      expect(appointment.providerId).toBe('565656565')
  });

  it('should not be able to create two appointment on the same time', async () => {
    const appointmentDate = new Date(2020, 11, 7, 11);

    await createAppointment.execute({
      date: appointmentDate,
      providerId: '565656565',
    })

    expect(
      createAppointment.execute({
        date: appointmentDate,
        providerId: '565656565',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
