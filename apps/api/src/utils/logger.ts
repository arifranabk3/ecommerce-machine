import pino from 'pino';
import { env } from '@sellzy/config';

export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  } : undefined,
  redact: {
    paths: [
      'password',
      'passwordHash',
      'token',
      'accessToken',
      'refreshToken',
      'jwt',
      'apiKey',
      'secret',
      'req.headers.authorization',
      'webhookSecret',
      'paymentSecret',
      'mfaSecret',
      'providerCredentials',
      'clientSecret'
    ],
    censor: '***REDACTED***'
  }
});
