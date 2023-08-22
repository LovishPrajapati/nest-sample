import pino, { stdSerializers } from 'pino';
import pkg from '../../../package.json';
import { isDev } from '../../config/keys';
import { pick } from './object';

export const logger = pino({
  name: pkg.name,
  timestamp: true,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  ...(isDev ? { transport: { target: 'pino-pretty' } } : {}),
  redact: {
    paths: ['req.body.otp', 'req.body.password', 'req.headers.authorization'],
    censor: '**CURSED**',
  },
  serializers: {
    req(req) {
      if (isDev) {
        return pick(req, ['url', 'method']);
      }

      return stdSerializers.req(req);
    },
    res(res) {
      if (isDev) {
        return pick(res, ['statusCode']);
      }

      return stdSerializers.res(res);
    },
    err(err) {
      return stdSerializers.err(err);
    },
  },
});
