import "reflect-metadata";

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from "@shared/errors/AppError";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
  })

  it('should be able to create a new appointment', async () => {
    const day = 10;
    const month = 4;
    const year = 2020;
    const hour = 12;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month, day, hour).getTime();
    });

    const date = new Date(year, month, day, hour+1);
    const provider_id = 'provider_id';
    const user_id = 'user_id';
    const appointment = await createAppointment.execute({
      date,
      user_id,
      provider_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create two appointments on the same time', async () => {
    const day = 10;
    const month = 4;
    const year = 2020;
    const hour = 12;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month, day, hour).getTime();
    });

    const date = new Date(year, month, day, hour+1);
    const provider_id = 'provider_id';
    const user_id = 'user_id';
    await createAppointment.execute({
      date,
      provider_id,
      user_id,
    });

    await expect(createAppointment.execute({
      date,
      provider_id,
      user_id,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    const day = 10;
    const month = 4;
    const year = 2020;
    const hour = 12;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month, day, hour).getTime();
    });

    const date = new Date(year, month, day, hour-1);
    const provider_id = 'provider_id';
    const user_id = 'user_id';
    await expect(createAppointment.execute({
      date,
      provider_id,
      user_id,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    const day = 10;
    const month = 4;
    const year = 2020;
    const hour = 12;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month, day, hour).getTime();
    });

    const date = new Date(year, month, day, hour+1);
    const provider_id = 'provider_id';
    const user_id = 'provider_id';
    await expect(createAppointment.execute({
      date,
      provider_id,
      user_id,
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and afetr 5pm', async () => {
    const day = 10;
    const month = 4;
    const year = 2020;
    const hour = 12;
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(year, month, day, hour).getTime();
    });

    const provider_id = 'provider_id';
    const user_id = 'user_id';

    const hourBeforeAllowed = 7;
    await expect(createAppointment.execute({
      date: new Date(year, month, day+1, hourBeforeAllowed),
      provider_id,
      user_id,
    })).rejects.toBeInstanceOf(AppError);

    const hourAfterAllowed = 18;
    await expect(createAppointment.execute({
      date: new Date(year, month, day+1, hourAfterAllowed),
      provider_id,
      user_id,
    })).rejects.toBeInstanceOf(AppError);
  });
});
