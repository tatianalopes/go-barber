import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDto from '@modules/appointments/dtos/ICreateAppointmentDto';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async create({ provider_id, date }: ICreateAppointmentDto): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment => isEqual(appointment.date,date));

    return findAppointment;
  }
}

export default AppointmentsRepository;
