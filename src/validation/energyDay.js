import Joi from 'joi';
import { STATIONS } from '../constants/index.js';

const stationIds = Object.keys(STATIONS);
const hourlyBlockSchema = Joi.object({
  hours: Joi.array().items(Joi.number()).length(24).required(),
});

const askoForecastSchema = Joi.object({
  hours: Joi.array().items(Joi.number()).length(24).required(),
  submittedAt: Joi.date().iso().required(),
});

export const upsertEnergyDaySchema = Joi.object({
  date: Joi.date().iso().required(),
  stationId: Joi.string()
    .valid(...stationIds)
    .required(),
  operatorForecast: hourlyBlockSchema,
  fact: hourlyBlockSchema,
  askoForecast: askoForecastSchema,
});

export const getEnergyDayQuerySchema = Joi.object({
  date: Joi.date().iso().required(),
  stationId: Joi.string()
    .valid(...stationIds)
    .required(),
});
