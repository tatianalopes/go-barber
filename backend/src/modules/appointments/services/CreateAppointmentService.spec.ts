import "reflect-metadata";

import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from "@shared/errors/AppError";

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const date = new Date();
    const provider_id = '123123123';
    const appointment = await createAppointment.execute({
      date,
      provider_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const date = new Date();
    const provider_id = '123123123';
    await createAppointment.execute({
      date,
      provider_id,
    });

    expect(createAppointment.execute({
      date,
      provider_id,
    })).rejects.toBeInstanceOf(AppError);
  });
})
