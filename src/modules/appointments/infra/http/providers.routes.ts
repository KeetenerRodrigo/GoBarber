import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/controller/ProvidersController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/controller/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/controller/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get('/:providerId/month-availability', providerMonthAvailabilityController.index);
providersRouter.get('/:providerId/day-availability', providerDayAvailabilityController.index);

export default providersRouter;
