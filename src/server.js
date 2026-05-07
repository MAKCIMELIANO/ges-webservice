import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getAllStations, getStationById } from './services/stations.js';

import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello GES!',
    });
  });

  app.get('/stations', async (req, res) => {
    const stations = await getAllStations();

    res.status(200).json({
      data: stations,
    });
  });

  app.get('/station/:id', async (req, res, next) => {
    const { id } = req.params;
    const station = await getStationById(id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.status(200).json({
      data: station,
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
