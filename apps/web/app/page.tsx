import { prisma } from "@dooh/db";
import { PipelineTrigger } from "./pipeline-trigger";
import { SimpleContentRequest } from "./simple-content-request";

const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  qa_pending: "Esperando QA",
  approved: "Aprobado",
  published: "Publicado",
  failed: "Falló",
};

const TYPE_LABEL: Record<string, string> = {
  text: "Texto",
  article: "Artículo",
  social_post: "Post social",
  image: "Imagen",
};

interface ContentPieceWithProject {
  id: string;
  project: { name: string };
  status: string;
  title: string;
  type: string;
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const contentPieces = await prisma.contentPiece.findMany({
    where: { project: { slug: "cafe-raiz-demo" } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { project: true },
  });
  const project = await prisma.project.findUnique({
    where: { slug: "cafe-raiz-demo" },
    include: { objectives: { orderBy: { createdAt: "asc" }, take: 1 } },
  });

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Cliente demo · Modo Simple · Fase 1 — Núcleo
        </p>
        <h1 className="text-2xl font-bold">DOOH Agency AI Platform</h1>
        <p className="text-sm text-slate-600">
          El usuario administra su negocio. La IA administra la complejidad.
        </p>
      </header>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          Negocio activo
        </p>
        <h2 className="mt-1 text-xl font-semibold">{project?.name ?? "Café Raíz"}</h2>
        <p className="mt-2 text-sm text-amber-950">
          {project?.objectives[0]?.description ?? "Objetivo demo pendiente de cargar"}
        </p>
        <p className="mt-2 text-xs text-amber-800">
          Datos ficticios para mostrar el flujo completo a potenciales clientes.
        </p>
      </section>

      <SimpleContentRequest />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Piezas de contenido</h2>
        {contentPieces.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no hay piezas de contenido.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {contentPieces.map((piece: ContentPieceWithProject) => (
              <li
                key={piece.id}
                className="flex items-center justify-between rounded border border-slate-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium">{piece.title}</p>
                  <p className="text-xs text-slate-500">
                    {piece.project.name} · {TYPE_LABEL[piece.type] ?? piece.type}
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                  {STATUS_LABEL[piece.status] ?? piece.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <details className="rounded-lg border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium">Modo Profesional</summary>
        <div className="mt-4">
          <h2 className="mb-3 text-base font-semibold">Generar contenido (pipeline de prueba)</h2>
          <PipelineTrigger />
        </div>
      </details>
    </main>
  );
}
