import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { providerId, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      date: parsedDate,
      providerId,
    });

    return response.json(appointment);
  };

  public async find(request: Request, response: Response): Promise<Response> {
    const appointments = await container.resolve(AppointmentRepository).find();
    return response.json(appointments);
  }
}
