import { EnergyDaysCollection } from '../db/models/energyDay.js';
import { ENERGY_DAY_STATUS } from '../constants/index.js';

export const upsertEnergyDay = async (payload) => {
  const { date, stationId, operatorForecast, fact, askoForecast } = payload;
  const existing = await EnergyDaysCollection.findOne({ date, stationId });
  const update = {};
  if (operatorForecast) {
    update.operatorForecast = operatorForecast;
  }
  if (fact) {
    update.fact = fact;
  }
  if (askoForecast) {
    update.askoForecast = askoForecast;
  }
  const willHaveFact = fact ?? existing?.fact;
  update.status = willHaveFact
    ? ENERGY_DAY_STATUS.COMPLETE
    : ENERGY_DAY_STATUS.DRAFT;
  const energyDay = await EnergyDaysCollection.findOneAndUpdate(
    { date, stationId },
    {
      $set: update,
      $setOnInsert: { date, stationId },
    },
    {
      returnDocument: 'after',
      upsert: true,
      runValidators: true,
    },
  );
  return energyDay;
};

export const getEnergyDayByDateAndStation = async ({ date, stationId }) => {
  const energyDay = await EnergyDaysCollection.findOne({ date, stationId });
  return energyDay;
};
