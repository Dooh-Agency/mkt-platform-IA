import { Queue } from "bullmq";
import { Redis } from "ioredis";

/**
 * Nombre único de la cola de jobs del sistema de tareas (ver docs/architecture.md §3).
 * apps/web encola, apps/worker consume — ambos deben apuntar a esta misma cola.
 */
export const JOB_QUEUE_NAME = "dooh-jobs";

export function createRedisConnection(): Redis {
  const url = process.env.REDIS_URL ?? "redis://localhost:6379";
  // BullMQ requiere maxRetriesPerRequest: null para sus comandos bloqueantes.
  return new Redis(url, { maxRetriesPerRequest: null });
}

export function createJobQueue(connection: Redis = createRedisConnection()): Queue {
  return new Queue(JOB_QUEUE_NAME, { connection });
}
