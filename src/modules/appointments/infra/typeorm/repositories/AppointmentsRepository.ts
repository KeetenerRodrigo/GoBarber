import { getRepository, Repository, Raw } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllInMonthFromProvidersDTO from '@modules/appointments/dtos/IFindAllInMonthFromProvidersDTO';
import IFindAllInDayFromProvidersDTO from '@modules/appointments/dtos/IFindAllInDayFromProvidersDTO';

class AppointmentRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({ providerId, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ providerId, user_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async find(): Promise<Appointment> {
    const appointment = this.ormRepository.create();

    return appointment;
  }


  public async findAllInMonthFromProvider({ providerId, month, year }: IFindAllInMonthFromProvidersDTO): Promise<Appointment[]> {
    const parsedMonth = month.toString().padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        providerId,
        date: Raw(dateFieldName => `to_char(${dateFieldName}), 'MM-YYYY' = '${parsedMonth}-${year}'`),
      }
    });

    return appointments;
  }


  public async findAllInDayFromProvider({ providerId, day, month, year }: IFindAllInDayFromProvidersDTO): Promise<Appointment[]> {
    const parsedMonth = month.toString().padStart(2, '0');
    const parsedDay = day.toString().padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        providerId,
        date: Raw(dateFieldName => `to_char(${dateFieldName}), 'DD-MM-YYYY' = '${parsedDay}-${parsedMonth}-${year}'`),
      }
    });

    return appointments;
  }
}

export default AppointmentRepository;
