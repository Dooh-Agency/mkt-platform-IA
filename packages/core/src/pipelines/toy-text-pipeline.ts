import { prisma } from "@dooh/db";
import { runQaGate } from "../qa.js";
import type { ToolRegistry } from "../tool-registry.js";
import { TEXT_GENERATION_TOOL_NAME } from "../tools/text-generation.js";

export interface RunToyTextPipelineInput {
  projectId: string;
  topic: string;
  objectiveId?: string;
  tools: ToolRegistry;
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
      objectiveId: input.objectiveId,
      type: "text",
      status: "draft",
      title: input.topic,
    },
  });

  const job = await prisma.job.create({
    data: {
      type: "generate_text",
      status: "running",
      payload: { topic: input.topic, objectiveId: input.objectiveId },
      contentPieceId: contentPiece.id,
    },
  });

  try {
    const objective = input.objectiveId
      ? await prisma.objective.findUnique({ where: { id: input.objectiveId } })
      : null;
    const generated = (await input.tools.get(TEXT_GENERATION_TOOL_NAME).run({
      prompt: buildPrompt(input.topic, objective),
    })) as { text: string; model: string };

    const qa = runQaGate({ type: "text", title: contentPiece.title, body: generated.text });
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

function buildPrompt(
  topic: string,
  objective: {
    description: string;
    audience: string | null;
    tone: string | null;
    frequency: string | null;
  } | null,
): string {
  const context = objective
    ? [
        `Objetivo: ${objective.description}`,
        objective.audience ? `Audiencia: ${objective.audience}` : null,
        objective.tone ? `Tono: ${objective.tone}` : null,
        objective.frequency ? `Frecuencia: ${objective.frequency}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return [context, `Escribí un texto corto (2-3 párrafos) sobre: ${topic}`]
    .filter(Boolean)
    .join("\n\n");
}
