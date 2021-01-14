import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderDayAvailability', () => {

  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentRepository);
  });

  it('should be able to list the day availability from provider', async () => {

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

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 14, 11).getTime();
    });

    const availability = await listProviderDayAvailabilityService.execute({
      providerId: 'user',
      day: 14,
      year: 2021,
      month: 1
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        {hour: 8, available: false},
        {hour: 9, available: false},
        {hour: 10, available: false},
        {hour: 14, available: false},
        {hour: 15, available: false},
        {hour: 16, available: true}
      ])
    )
  });
});
