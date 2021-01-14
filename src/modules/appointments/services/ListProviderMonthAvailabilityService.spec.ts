import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderMonthAvailability', () => {

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(fakeAppointmentRepository);
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 8, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 9, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 10, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 11, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 12, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 13, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 14, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 15, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 16, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 14, 17, 0, 0)
    });

    await fakeAppointmentRepository.create({
      providerId: 'user',
      user_id: 'user',
      date: new Date(2021, 0, 15, 8, 0, 0)
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      providerId: 'user',
      year: 2021,
      month: 1
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        {day: 13, available: true},
        {day: 14, available: false},
        {day: 15, available: true},
        {day: 16, available: true},
      ])
    )
  });
});
