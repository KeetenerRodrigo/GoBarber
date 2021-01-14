import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderAppointments', () => {

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(fakeAppointmentRepository);
  });

  it('should be able to list the appointmens on a specific day', async () => {

    const appointment1 = await fakeAppointmentRepository.create({
      providerId: 'provider',
      user_id: 'user',
      date: new Date(2021, 0, 14, 14, 0, 0)
    });


    const appointment2 = await fakeAppointmentRepository.create({
      providerId: 'provider',
      user_id: 'user',
      date: new Date(2021, 0, 14, 15, 0, 0)
    });

    const appointments = await listProviderAppointmentsService.execute({
      providerId: 'provider',
      day: 14,
      year: 2021,
      month: 1
    })

    expect(appointments).toEqual([appointment1, appointment2]);
});
});
