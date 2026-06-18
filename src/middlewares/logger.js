import pinoHttp from 'pino-http';
import pretty from 'pino-pretty';

export const logger = pinoHttp({
  stream: pretty({
    colorize: true,
    translateTime: 'HH:MM:ss.l',
    ignore: 'pid,hostname',
  }),
});
