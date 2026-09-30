import { EnergyDaysCollection } from '../db/models/energyDay.js';
import { ENERGY_DAY_STATUS, STATIONS } from '../constants/index.js';

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

function deviationFromHours(operatorHours, factHours) {
  if (!Array.isArray(operatorHours) || !Array.isArray(factHours)) {
    return null;
  }

  let positiveDeviation = 0;
  let negativeDeviation = 0;
  let totalForecast = 0;
  let totalFact = 0;

  for (let hour = 0; hour < 24; hour += 1) {
    const forecast = Number(operatorHours[hour]) || 0;
    const fact = Number(factHours[hour]) || 0;
    const difference = fact - forecast;

    totalForecast += forecast;
    totalFact += fact;

    if (difference > 0) {
      positiveDeviation += difference;
    } else if (difference < 0) {
      negativeDeviation += difference;
    }
  }

  return { positiveDeviation, negativeDeviation, totalForecast, totalFact };
}

function emptyStationTotals(stationId) {
  return {
    stationId,
    name: STATIONS[stationId]?.name || stationId,
    days: 0,
    comparedDays: 0,
    totalForecast: 0,
    totalFact: 0,
    positiveDeviation: 0,
    negativeDeviation: 0,
  };
}

/**
 * Сумма откл − / откл + за месяц из уже записанных дней.
 * Откл + = факт выше прогноза, откл − = факт ниже (отрицательное число).
 */
export const getEnergyMonthSummary = async ({ year, month, stationId }) => {
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  const match = { monthKey };
  if (stationId) {
    match.stationId = stationId;
  }

  const days = await EnergyDaysCollection.aggregate([
    {
      $addFields: {
        monthKey: {
          $dateToString: { format: '%Y-%m', date: '$date', timezone: 'UTC' },
        },
      },
    },
    { $match: match },
    { $sort: { date: 1, stationId: 1 } },
  ]);

  const byStation = new Map();

  for (const day of days) {
    if (!byStation.has(day.stationId)) {
      byStation.set(day.stationId, emptyStationTotals(day.stationId));
    }

    const station = byStation.get(day.stationId);
    station.days += 1;

    const deviation = deviationFromHours(
      day.operatorForecast?.hours,
      day.fact?.hours,
    );
    if (!deviation) continue;

    station.comparedDays += 1;
    station.totalForecast += deviation.totalForecast;
    station.totalFact += deviation.totalFact;
    station.positiveDeviation += deviation.positiveDeviation;
    station.negativeDeviation += deviation.negativeDeviation;
  }

  const order = Object.keys(STATIONS);
  const stations = [...byStation.values()].sort(
    (a, b) => order.indexOf(a.stationId) - order.indexOf(b.stationId),
  );

  const totals = stations.reduce(
    (sum, station) => {
      sum.days += station.days;
      sum.comparedDays += station.comparedDays;
      sum.totalForecast += station.totalForecast;
      sum.totalFact += station.totalFact;
      sum.positiveDeviation += station.positiveDeviation;
      sum.negativeDeviation += station.negativeDeviation;
      return sum;
    },
    {
      days: 0,
      comparedDays: 0,
      totalForecast: 0,
      totalFact: 0,
      positiveDeviation: 0,
      negativeDeviation: 0,
    },
  );

  return {
    year: Number(year),
    month: Number(month),
    stationId: stationId || null,
    stations,
    totals,
  };
};
