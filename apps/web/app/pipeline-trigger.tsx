"use client";

import { type FormEvent, useState } from "react";

export function PipelineTrigger() {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/pipeline-runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setStatus(data.error ?? "Error al encolar el job");
        return;
      }

      setStatus("Job encolado. El worker lo va a procesar en breve — actualizá la página.");
      setTopic("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4"
    >
      <label htmlFor="topic" className="text-sm font-medium">
        Tema del contenido
      </label>
      <input
        id="topic"
        name="topic"
        required
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
        placeholder="Ej: 3 formas de automatizar tu marketing sin saber de IA"
        className="rounded border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? "Encolando..." : "Generar"}
      </button>
      {status && <p className="text-sm text-slate-600">{status}</p>}
    </form>
  );
}
