import { Router } from 'express';

import SessionsController from '@modules/users/infra/controller/SessionsController';

const usersSessions = Router();
const sessionsController = new SessionsController();

usersSessions.post('/', sessionsController.create);

export default usersSessions;
