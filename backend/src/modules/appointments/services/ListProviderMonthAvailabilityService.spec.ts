import 'reflect-metadata';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const START_HOUR = 8;
    const END_HOUR = 17;

    const provider_id = 'provider_id';
    const fullDay = 20;
    const month = 4;
    const year = 2020;
    for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
      await createAppointment(provider_id, fullDay, month, year, hour);
    }

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      year,
      month,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: fullDay, available: false },
        { day: 21, available: true },
      ]),
    );
  });

  async function createAppointment(
    provider_id: string,
    day: number,
    month: number,
    year: number,
    hour: number,
  ) {
    const user_id = 'user_id';
    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(year, month - 1, day, hour, 0, 0),
    });
  }
});
