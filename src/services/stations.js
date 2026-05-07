import { readFile } from 'fs/promises';

export const getAllStations = async () => {
  try {
    const data = await readFile('./src/db/students.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading stations data:', error);
    return [];
  }
};

export const getStationById = async (id) => {
  try {
    const data = await readFile('./src/db/students.json', 'utf8');
    const stations = JSON.parse(data);
    return stations.find((station) => station._id.$oid === id) || null;
  } catch (error) {
    console.error('Error reading station by id:', error);
    return null;
  }
};
