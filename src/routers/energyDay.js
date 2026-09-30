import { Router } from 'express';

import {
  upsertEnergyDayController,
  getEnergyDayByDateAndStationController,
  getEnergyMonthSummaryController,
} from '../controllers/energyDay.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import {
  upsertEnergyDaySchema,
  getEnergyDayQuerySchema,
  getEnergyMonthQuerySchema,
} from '../validation/energyDay.js';

const router = Router();

router.get(
  '/month',
  validateQuery(getEnergyMonthQuerySchema),
  ctrlWrapper(getEnergyMonthSummaryController),
);

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
