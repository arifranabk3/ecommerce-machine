import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { env } from '@sellzy/config';
import pino from 'pino';

const logger = pino({ name: 'sellzy-worker' });
const connection = new Redis(env.REDIS_URI, { maxRetriesPerRequest: null });

export function startWorker() {
  const worker = new Worker(
    'system-events',
    async (job: Job) => {
      logger.info({ jobId: job.id, name: job.name, data: job.data }, 'Processing background event job');
      
      switch (job.name) {
        case 'SEND_WELCOME_EMAIL':
          // Process welcome email task
          logger.info({ tenantId: job.data.tenantId }, 'Sending welcome notification');
          break;
        default:
          logger.warn({ jobName: job.name }, 'Unhandled background job type');
      }
    },
    {
      connection,
      concurrency: 5,
      limiter: {
        max: 10,
        duration: 1000
      }
    }
  );

  worker.on('completed', (job: Job) => {
    logger.info({ jobId: job.id }, 'Job completed successfully');
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    logger.error({ jobId: job?.id, err }, 'Job failed');
  });

  logger.info('BullMQ Background Worker started listening on system-events queue');
}
