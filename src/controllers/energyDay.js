import {
  upsertEnergyDay,
  getEnergyDayByDateAndStation,
  getEnergyMonthSummary,
} from '../services/energyDay.js';
import createHttpError from 'http-errors';

export const upsertEnergyDayController = async (req, res) => {
  const { date, stationId } = req.body;

  const existingEnergyDay = await getEnergyDayByDateAndStation({
    date,
    stationId,
  });

  const energyDay = await upsertEnergyDay(req.body);

  const status = existingEnergyDay ? 200 : 201;

  res.status(status).json({
    status,
    message: 'Successfully upserted energy day!',
    data: energyDay,
  });
};

export const getEnergyMonthSummaryController = async (req, res) => {
  const summary = await getEnergyMonthSummary({
    year: Number(req.query.year),
    month: Number(req.query.month),
    stationId: req.query.stationId,
  });

  res.json({
    status: 200,
    message: 'Successfully aggregated energy month!',
    data: summary,
  });
};

export const getEnergyDayByDateAndStationController = async (req, res) => {
  const { date, stationId } = req.query;

  const energyDay = await getEnergyDayByDateAndStation({
    date,
    stationId,
  });

  if (!energyDay) {
    throw createHttpError(404, 'Energy day not found');
  }

  res.json({
    status: 200,
    message: 'Successfully found energy day!',
    data: energyDay,
  });
};
