import { Router } from 'express';

import appointmentsRouter from '@modules/appointments/infra/http/appointments.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';
import usersSessions from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', userRouter);
routes.use('/sessions', usersSessions);
routes.use('/password', passwordRouter);

export default routes;
