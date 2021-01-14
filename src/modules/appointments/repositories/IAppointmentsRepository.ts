import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllInMonthFromProvidersDTO from '../dtos/IFindAllInMonthFromProvidersDTO';
import IFindAllInDayFromProvidersDTO from '../dtos/IFindAllInDayFromProvidersDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(date: IFindAllInMonthFromProvidersDTO): Promise<Appointment[]>;
  findAllInDayFromProvider(date: IFindAllInDayFromProvidersDTO):Promise<Appointment[]>
}
