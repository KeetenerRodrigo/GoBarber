import { getHours, isBefore, startOfHour, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';


import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,


    @inject('NotificatiosRepository')
    private notificatiosRepository: INotificationsRepository,
  ) { }

  public async execute({
    date,
    providerId,
    user_id
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if(isBefore(appointmentDate, Date.now())){
      throw new AppError("You can't create an a appointment on a past date.", 400);
    }

    if(user_id === providerId) {
      throw new AppError("You can't create an a appointment with yourself.", 400);
    }

   if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
    throw new AppError("You can only create appointments between 8am and 5pm", 400);
   }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 400);
    }

    const appointment = await this.appointmentsRepository.create({
      providerId,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm")

    await this.notificatiosRepository.create({
      recipient_id: providerId,
      content: `Novo agendamento para o dia ${dateFormatted}`
    })

    return appointment;
  }
}

export default CreateAppointmentService;
