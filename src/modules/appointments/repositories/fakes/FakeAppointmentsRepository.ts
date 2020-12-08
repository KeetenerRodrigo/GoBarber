import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';


import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentRepository implements IAppointmentsRepository {

  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date)
    );

    return findAppointment;
  }

  public async create({ providerId, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    // Object.assign(appointment, {})

    appointment.id = uuid();
    appointment.date = date;
    appointment.providerId = providerId;

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentRepository;