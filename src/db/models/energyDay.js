import { model, Schema } from 'mongoose';

import { STATIONS, ENERGY_DAY_STATUS } from '../../constants/index.js';

const hourlyBlockSchema = new Schema(
  {
    hours: {
      type: [Number],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 24,
        message: 'hours must contain exactly 24 values',
      },
    },
  },
  { _id: false },
);
const askoForecastSchema = new Schema(
  {
    hours: {
      type: [Number],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length === 24,
        message: 'hours must contain exactly 24 values',
      },
    },
    submittedAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
);
const energyDaySchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    stationId: {
      type: String,
      required: true,
      enum: Object.keys(STATIONS),
    },
    status: {
      type: String,
      enum: Object.values(ENERGY_DAY_STATUS),
      default: ENERGY_DAY_STATUS.DRAFT,
    },
    operatorForecast: hourlyBlockSchema,
    fact: hourlyBlockSchema,
    askoForecast: askoForecastSchema,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
energyDaySchema.index({ date: 1, stationId: 1 }, { unique: true });

export const EnergyDaysCollection = model('energydays', energyDaySchema);
