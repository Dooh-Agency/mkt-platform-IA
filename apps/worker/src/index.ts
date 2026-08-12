import { JOB_QUEUE_NAME, createRedisConnection, runToyTextPipeline } from "@dooh/core";
import { AnthropicTextProvider } from "@dooh/providers";
import { type Job, Worker } from "bullmq";

interface GenerateTextJobData {
  projectId: string;
  topic: string;
}

const connection = createRedisConnection();
const provider = new AnthropicTextProvider();

async function processJob(job: Job<GenerateTextJobData>) {
  switch (job.name) {
    case "generate_text": {
      const result = await runToyTextPipeline({
        projectId: job.data.projectId,
        topic: job.data.topic,
        provider,
      });
      return result;
    }
    default:
      throw new Error(`Tipo de job desconocido: ${job.name}`);
  }
}

const worker = new Worker(JOB_QUEUE_NAME, processJob, { connection });

worker.on("completed", (job) => {
  console.log(`[worker] job ${job.id} (${job.name}) completado`);
});

worker.on("failed", (job, error) => {
  console.error(`[worker] job ${job?.id} (${job?.name}) falló:`, error.message);
});

console.log(`[worker] escuchando la cola "${JOB_QUEUE_NAME}"`);

async function shutdown() {
  console.log("[worker] cerrando...");
  await worker.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
