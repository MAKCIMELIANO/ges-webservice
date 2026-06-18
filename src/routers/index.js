import { Router } from 'express';
import studentsRouter from './students.js';
import authRouter from './auth.js';
import energyDayRouter from './energyDay.js';

const router = Router();

router.use('/students', studentsRouter);
router.use('/auth', authRouter);
router.use('/energy-day', energyDayRouter);

export default router;
