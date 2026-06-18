import { Router } from 'express';

import {
  upsertEnergyDayController,
  getEnergyDayByDateAndStationController,
} from '../controllers/energyDay.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import {
  upsertEnergyDaySchema,
  getEnergyDayQuerySchema,
} from '../validation/energyDay.js';

const router = Router();

router.get(
  '/',
  validateQuery(getEnergyDayQuerySchema),
  ctrlWrapper(getEnergyDayByDateAndStationController),
);

router.post(
  '/',
  validateBody(upsertEnergyDaySchema),
  ctrlWrapper(upsertEnergyDayController),
);

export default router;
