"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

const GOALS = [
  "Atraer más visitas al local",
  "Conseguir más pedidos para llevar",
  "Hacer que más personas conozcan el negocio",
];

const FREQUENCIES = [
  "1 publicación por semana",
  "3 publicaciones por semana",
  "Todos los días hábiles",
];

export function SimpleContentRequest() {
  const router = useRouter();
  const [goal, setGoal] = useState("Atraer más visitas al local");
  const [frequency, setFrequency] = useState("3 publicaciones por semana");
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
        body: JSON.stringify({ objective: goal, frequency, topic }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setStatus(data.error ?? "No pudimos preparar el contenido");
        return;
      }

      setTopic("");
      setStatus(
        "Listo. Estamos preparando tu contenido; actualizaremos esta pantalla cuando esté listo.",
      );
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">Preparemos tu próxima publicación</h2>
        <p className="mt-1 text-sm text-slate-600">
          Respondé tres preguntas. Nosotros nos ocupamos del resto.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="goal">
        ¿Qué querés lograr?
        <select
          id="goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          className="rounded border border-slate-300 bg-white px-3 py-2 font-normal"
        >
          {GOALS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="frequency">
        ¿Con qué frecuencia querés publicar?
        <select
          id="frequency"
          value={frequency}
          onChange={(event) => setFrequency(event.target.value)}
          className="rounded border border-slate-300 bg-white px-3 py-2 font-normal"
        >
          {FREQUENCIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium" htmlFor="topic">
        ¿Sobre qué te gustaría hablar esta vez?
        <input
          id="topic"
          required
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Ej.: nuestra nueva promo de merienda"
          className="rounded border border-slate-300 px-3 py-2 font-normal"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white
          disabled:opacity-50"
      >
        {isSubmitting ? "Preparando..." : "Preparar contenido"}
      </button>
      {status && <p className="text-sm text-slate-600">{status}</p>}
    </form>
  );
}
