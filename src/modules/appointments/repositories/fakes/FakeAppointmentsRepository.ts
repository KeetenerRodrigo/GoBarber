import { uuid } from 'uuidv4';
import { getMonth, isEqual, getYear, getDate } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';


import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllInMonthFromProvidersDTO from '@modules/appointments/dtos/IFindAllInMonthFromProvidersDTO';
import IFindAllInDayFromProvidersDTO from '@modules/appointments/dtos/IFindAllInDayFromProvidersDTO';

class AppointmentRepository implements IAppointmentsRepository {

  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date)
    );

    return findAppointment;
  }

  public async create({ providerId, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    // Object.assign(appointment, {})

    appointment.id = uuid();
    appointment.date = date;
    appointment.providerId = providerId;
    appointment.user_id = user_id;

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({ providerId, month, year }: IFindAllInMonthFromProvidersDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment =>
      appointment.providerId === providerId &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
    );

    return appointments;
  }

  public async findAllInDayFromProvider({ providerId, day, month, year }: IFindAllInDayFromProvidersDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment =>
      appointment.providerId === providerId &&
      getDate(appointment.date) === day &&
      getMonth(appointment.date) + 1 === month &&
      getYear(appointment.date) === year
    );

    return appointments;
  }
}

export default AppointmentRepository;
