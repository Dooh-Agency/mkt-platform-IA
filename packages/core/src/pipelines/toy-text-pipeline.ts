import { prisma } from "@dooh/db";
import type { TextGenerationProvider } from "@dooh/providers";
import { runQaGate } from "../qa.js";

export interface RunToyTextPipelineInput {
  projectId: string;
  topic: string;
  provider: TextGenerationProvider;
}

export interface RunToyTextPipelineResult {
  contentPieceId: string;
  jobId: string;
  status: "approved" | "failed";
  reasons: string[];
}

/**
 * Pipeline mínimo que valida el Core de punta a punta (docs/roadmap.md, Fase 1,
 * Definition of Done): entra un tema, corre un job real contra un proveedor de
 * IA, se guarda en memoria compartida, pasa el QA gate, y queda en estado
 * `approved` o `failed`. No publica en ninguna plataforma real todavía —
 * eso es responsabilidad del Distribution layer en Fase 2.
 */
export async function runToyTextPipeline(
  input: RunToyTextPipelineInput,
): Promise<RunToyTextPipelineResult> {
  const contentPiece = await prisma.contentPiece.create({
    data: {
      projectId: input.projectId,
      type: "text",
      status: "draft",
      title: input.topic,
    },
  });

  const job = await prisma.job.create({
    data: {
      type: "generate_text",
      status: "running",
      payload: { topic: input.topic },
      contentPieceId: contentPiece.id,
    },
  });

  try {
    const generated = await input.provider.generateText({
      prompt: `Escribí un texto corto (2-3 párrafos) sobre: ${input.topic}`,
    });

    const qa = runQaGate({ title: contentPiece.title, body: generated.text });
    const status: RunToyTextPipelineResult["status"] = qa.passed ? "approved" : "failed";

    await prisma.contentPiece.update({
      where: { id: contentPiece.id },
      data: { body: generated.text, status: qa.passed ? "approved" : "failed" },
    });

    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: qa.passed ? "completed" : "failed",
        result: { model: generated.model, qaPassed: qa.passed },
        error: qa.passed ? null : qa.reasons.join("; "),
      },
    });

    return { contentPieceId: contentPiece.id, jobId: job.id, status, reasons: qa.reasons };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";

    await prisma.job.update({
      where: { id: job.id },
      data: { status: "failed", error: message },
    });
    await prisma.contentPiece.update({
      where: { id: contentPiece.id },
      data: { status: "failed" },
    });

    throw error;
  }
}
