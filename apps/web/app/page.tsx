import { prisma } from "@dooh/db";
import { PipelineTrigger } from "./pipeline-trigger";

const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  qa_pending: "Esperando QA",
  approved: "Aprobado",
  published: "Publicado",
  failed: "Falló",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const contentPieces = await prisma.contentPiece.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { project: true },
  });

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Modo Profesional · Fase 1 — Núcleo
        </p>
        <h1 className="text-2xl font-bold">DOOH Agency AI Platform</h1>
        <p className="text-sm text-slate-600">
          El usuario administra su negocio. La IA administra la complejidad.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Generar contenido (pipeline de prueba)</h2>
        <PipelineTrigger />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Piezas de contenido</h2>
        {contentPieces.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no hay piezas de contenido.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {contentPieces.map((piece) => (
              <li
                key={piece.id}
                className="flex items-center justify-between rounded border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium">{piece.title}</p>
                  <p className="text-xs text-slate-500">{piece.project.name}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                  {STATUS_LABEL[piece.status] ?? piece.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
