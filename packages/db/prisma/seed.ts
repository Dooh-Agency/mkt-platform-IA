import type { Prisma } from "@prisma/client";
import { prisma } from "../src/client.js";

const DEMO_PROJECT = { name: "Café Raíz", slug: "cafe-raiz-demo" };

/**
 * Datos semilla para recorrer la experiencia de un cliente ficticio desde el
 * dashboard, sin depender de una cuenta real ni de que el pipeline haya
 * corrido antes. Es idempotente para poder preparar una demo local varias veces.
 */
async function main() {
  const project = await prisma.project.upsert({
    where: { slug: DEMO_PROJECT.slug },
    update: { name: DEMO_PROJECT.name },
    create: DEMO_PROJECT,
  });

  const objective =
    (await prisma.objective.findFirst({
      where: {
        projectId: project.id,
        description: "Aumentar las visitas al local y los pedidos de café para llevar",
      },
    })) ??
    (await prisma.objective.create({
      data: {
        projectId: project.id,
        description: "Aumentar las visitas al local y los pedidos de café para llevar",
        audience: "Personas de 25 a 45 años que trabajan o estudian cerca",
        tone: "Cálido, cercano y con identidad de barrio",
        frequency: "3 publicaciones por semana",
      },
    }));

  const existingResearch = await prisma.researchNote.findFirst({
    where: { projectId: project.id, title: "Perfil del cliente de Café Raíz" },
  });
  if (!existingResearch) {
    await prisma.researchNote.create({
      data: {
        projectId: project.id,
        objectiveId: objective.id,
        title: "Perfil del cliente de Café Raíz",
        content:
          "El público busca un lugar cómodo para una pausa breve, valora el café de especialidad, los productos frescos y las promociones simples para llevar. Las mejores oportunidades son la mañana y la merienda.",
      },
    });
  }

  const published = await upsertContentPiece({
    projectId: project.id,
    objectiveId: objective.id,
    title: "El café de especialidad también puede ser parte de tu rutina",
    type: "social_post",
    status: "published",
    body: "Una pausa rica cambia el día. Pasá por Café Raíz y probá nuestro blend de la semana, recién molido y listo para llevar.",
  });
  const qaPending = await upsertContentPiece({
    projectId: project.id,
    objectiveId: objective.id,
    title: "3 ideas para disfrutar mejor tu café en la mañana",
    type: "article",
    status: "qa_pending",
    body: "Borrador demo pendiente de revisión de calidad antes de publicarlo.",
  });
  await upsertContentPiece({
    projectId: project.id,
    objectiveId: objective.id,
    title: "Promo merienda: café + algo dulce",
    type: "image",
    status: "draft",
    body: "Pieza visual demo lista para completar con un asset.",
  });

  await upsertJob({
    type: "generate_text",
    status: "completed",
    payload: { topic: "Café de especialidad para la rutina diaria" },
    result: { characters: 158, demo: true },
    attempts: 1,
    contentPieceId: published.id,
  });
  await upsertJob({
    type: "qa_check",
    status: "pending",
    payload: { contentPieceId: qaPending.id },
  });
  await upsertJob({
    type: "generate_image",
    status: "failed",
    payload: { topic: "Promo merienda Café Raíz" },
    error: "Demo: asset pendiente de generación",
    attempts: 2,
  });

  console.log("Seed completo:", { project: project.slug });
}

async function upsertContentPiece(input: {
  projectId: string;
  objectiveId: string;
  title: string;
  type: "social_post" | "article" | "image";
  status: "draft" | "qa_pending" | "published";
  body: string;
}) {
  const existing = await prisma.contentPiece.findFirst({
    where: { projectId: input.projectId, title: input.title },
  });
  return existing
    ? prisma.contentPiece.update({ where: { id: existing.id }, data: input })
    : prisma.contentPiece.create({ data: input });
}

async function upsertJob(input: {
  type: string;
  status: "pending" | "completed" | "failed";
  payload: Prisma.InputJsonValue;
  result?: Prisma.InputJsonValue;
  error?: string;
  attempts?: number;
  contentPieceId?: string;
}) {
  const existing = await prisma.job.findFirst({
    where: { type: input.type, payload: input.payload },
  });
  return existing
    ? prisma.job.update({ where: { id: existing.id }, data: input })
    : prisma.job.create({ data: input });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
