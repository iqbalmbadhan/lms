import { Queue, Worker } from 'bullmq'
import { redis } from '../lib/redis'

export const embeddingQueue = new Queue('embeddings', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  },
})

export const emailQueue = new Queue('emails', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  },
})

export function createEmbeddingWorker(
  processor: (job: { data: { type: string; id: string; content: string } }) => Promise<void>
): Worker {
  return new Worker('embeddings', processor, { connection: redis })
}
