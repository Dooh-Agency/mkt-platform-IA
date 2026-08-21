import { createJobQueue } from "@dooh/core";
import { prisma } from "@dooh/db";
import { NextResponse } from "next/server";

const DEMO_PROJECT_SLUG = "cafe-raiz-demo";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    topic?: unknown;
    objective?: unknown;
    frequency?: unknown;
  };
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const objectiveDescription = typeof body.objective === "string" ? body.objective.trim() : "";
  const frequency = typeof body.frequency === "string" ? body.frequency.trim() : "";

  if (!topic) {
    return NextResponse.json({ error: "El tema es obligatorio" }, { status: 400 });
  }

  const project = await prisma.project.upsert({
    where: { slug: DEMO_PROJECT_SLUG },
    update: {},
    create: { name: "Café Raíz", slug: DEMO_PROJECT_SLUG },
  });

  const objective = objectiveDescription
    ? ((await prisma.objective.findFirst({
        where: {
          projectId: project.id,
          description: objectiveDescription,
          frequency: frequency || null,
        },
      })) ??
      (await prisma.objective.create({
        data: {
          projectId: project.id,
          description: objectiveDescription,
          frequency: frequency || null,
        },
      })))
    : null;

  const queue = createJobQueue();
  try {
    const job = await queue.add("generate_text", {
      projectId: project.id,
      objectiveId: objective?.id,
      topic,
    });
    return NextResponse.json({ jobId: job.id }, { status: 202 });
  } finally {
    await queue.close();
  }
}
