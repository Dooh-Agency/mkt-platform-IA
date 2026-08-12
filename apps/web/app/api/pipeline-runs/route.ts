import { createJobQueue } from "@dooh/core";
import { prisma } from "@dooh/db";
import { NextResponse } from "next/server";

const DEMO_PROJECT_SLUG = "dooh-youtube";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { topic?: unknown };
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";

  if (!topic) {
    return NextResponse.json({ error: "El tema es obligatorio" }, { status: 400 });
  }

  const project = await prisma.project.upsert({
    where: { slug: DEMO_PROJECT_SLUG },
    update: {},
    create: { name: "Canal de YouTube DOOH", slug: DEMO_PROJECT_SLUG },
  });

  const queue = createJobQueue();
  try {
    const job = await queue.add("generate_text", { projectId: project.id, topic });
    return NextResponse.json({ jobId: job.id }, { status: 202 });
  } finally {
    await queue.close();
  }
}
