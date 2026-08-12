import { prisma } from "../src/client.js";

/**
 * Datos semilla para tener el dashboard y el pipeline de juguete de Fase 1
 * navegables sin depender de que el orquestador haya corrido antes.
 * No se usa en producción — ver docs/roadmap.md, Fase 1.
 */
async function main() {
  const project = await prisma.project.upsert({
    where: { slug: "dooh-youtube" },
    update: {},
    create: {
      name: "Canal de YouTube DOOH",
      slug: "dooh-youtube",
    },
  });

  const objective = await prisma.objective.create({
    data: {
      projectId: project.id,
      description: "Publicar contenido semanal sobre marketing con IA para PyMEs",
      audience: "Dueños de PyMEs sin equipo de marketing",
      tone: "Directo, cercano, sin jerga técnica",
      frequency: "semanal",
    },
  });

  await prisma.researchNote.create({
    data: {
      projectId: project.id,
      objectiveId: objective.id,
      title: "Tendencias de búsqueda: 'marketing con IA para pymes'",
      content:
        "Investigación demo: volumen de búsqueda creciente, baja competencia de contenido en español dirigido a PyMEs (no a agencias).",
    },
  });

  const published = await prisma.contentPiece.create({
    data: {
      projectId: project.id,
      objectiveId: objective.id,
      type: "text",
      status: "published",
      title: "5 formas de automatizar tu marketing sin saber de IA",
      body: "Pieza de contenido demo ya publicada, usada para probar el dashboard.",
    },
  });

  const qaPending = await prisma.contentPiece.create({
    data: {
      projectId: project.id,
      objectiveId: objective.id,
      type: "text",
      status: "qa_pending",
      title: "Cómo elegir tu primer canal de distribución",
      body: "Pieza de contenido demo pendiente de control de calidad.",
    },
  });

  await prisma.job.create({
    data: {
      type: "generate_text",
      status: "completed",
      payload: { topic: "5 formas de automatizar tu marketing sin saber de IA" },
      result: { characters: 812 },
      attempts: 1,
      contentPieceId: published.id,
    },
  });

  await prisma.job.create({
    data: {
      type: "generate_text",
      status: "failed",
      payload: { topic: "Errores comunes al delegar marketing en IA" },
      error: "Demo: timeout simulado del proveedor de IA",
      attempts: 3,
    },
  });

  await prisma.job.create({
    data: {
      type: "qa_check",
      status: "pending",
      payload: { contentPieceId: qaPending.id },
    },
  });

  console.log("Seed completo:", { project: project.slug });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
