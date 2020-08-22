import "reflect-metadata";

import ListProviderDayAvailabilityService from "./ListProviderDayAvailabilityService";
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
  });

  it('should be able to list the month availability from provider', async () => {
    const provider_id = 'user';
    const user_id = 'user';
    const day = 20;
    const month = 4;
    const year = 2020;
    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(year, month-1, day, 14, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(year, month-1, day, 16, 0, 0),
    });

    const hourNow = 11;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month-1, day, hourNow).getTime();
    });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id,
      day,
      year,
      month,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
      { hour: 8,  available: false},
      { hour: 9,  available: false},
      { hour: 10,  available: false},
      { hour: 11,  available: false},
      { hour: 12,  available: true},
      { hour: 14,  available: false},
      { hour: 15,  available: true},
      { hour: 16,  available: false},
      { hour: 17,  available: true},
      ]),
    );
  });
})
