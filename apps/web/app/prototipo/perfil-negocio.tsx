"use client";

import { useState } from "react";

export type BusinessProfile = {
  name: string;
  category: string;
  offering: string;
  location: string;
  audience: string;
  goals: string[];
  tone: string;
  toneDetails: string;
  contact: string;
  instagram: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  font: string;
};

export const initialProfile: BusinessProfile = {
  name: "Kanso",
  category: "Cerámica para gastronomía",
  offering: "Vajilla de gres para espacios gastronómicos",
  location: "",
  audience: "Restaurantes, hoteles, chefs, cafeterías y consumidores particulares",
  goals: ["Recibir consultas", "Mostrar mi trabajo", "Atraer clientes", "Vender productos"],
  tone: "",
  toneDetails: "",
  contact: "",
  instagram: "https://www.instagram.com/kanso.ar/",
  logo: null,
  primaryColor: "#294f3f",
  secondaryColor: "#c58d74",
  font: "",
};

const goals = [
  "Recibir consultas",
  "Mostrar mi trabajo",
  "Atraer clientes",
  "Vender productos",
  "Dar a conocer mi marca",
];
const steps = ["Tu negocio", "Tus objetivos", "Tu comunicación", "Tu identidad"];
const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base text-[var(--color-text)]";
const labelClass = "block text-sm font-medium";

export function BusinessSetup({
  initial,
  onSave,
  onClose,
}: { initial: BusinessProfile; onSave: (profile: BusinessProfile) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(initial);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const update = <K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  function next() {
    if (!draft.name.trim()) {
      setError("Ingresá el nombre de tu negocio para continuar.");
      return;
    }
    setError("");
    if (step < steps.length - 1) setStep(step + 1);
    else onSave({ ...draft, name: draft.name.trim() });
  }
  return (
    <section
      aria-labelledby="setup-title"
      className="mx-auto max-w-2xl rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--color-text-muted)]">
            Tu perfil · Paso {step + 1} de {steps.length}
          </p>
          <h1 id="setup-title" className="mt-2 text-2xl font-semibold">
            {steps[step]}
          </h1>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] text-sm font-medium underline"
        >
          Cerrar
        </button>
      </div>
      <div className="mt-4 flex gap-2" aria-label={`Paso ${step + 1} de ${steps.length}`}>
        {steps.map((name, index) => (
          <span
            key={name}
            aria-hidden="true"
            className={`h-1 flex-1 rounded-full ${index <= step ? "bg-[var(--color-primary)]" : "bg-[var(--color-border-subtle)]"}`}
          />
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">
        Completá lo que tengas a mano. Podés volver y modificarlo más adelante.
      </p>
      {step === 0 && (
        <div className="mt-5 grid gap-4">
          <label className={labelClass}>
            Nombre del negocio <span className="text-[var(--color-danger)]">*</span>
            <input
              className={inputClass}
              value={draft.name}
              maxLength={80}
              onChange={(e) => update("name", e.target.value)}
            />
          </label>
          <label className={labelClass}>
            ¿A qué se dedica?
            <input
              className={inputClass}
              value={draft.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="Ej.: cerámica para gastronomía"
            />
          </label>
          <label className={labelClass}>
            ¿Qué productos o servicios ofrecés?
            <textarea
              className={inputClass}
              rows={3}
              value={draft.offering}
              onChange={(e) => update("offering", e.target.value)}
              placeholder="Contanos brevemente qué ofrecés"
            />
          </label>
          <label className={labelClass}>
            ¿Dónde está o en qué zona trabaja?{" "}
            <span className="font-normal text-[var(--color-text-muted)]">(opcional)</span>
            <input
              className={inputClass}
              value={draft.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Ciudad o zona"
            />
          </label>
        </div>
      )}
      {step === 1 && (
        <div className="mt-5 grid gap-5">
          <fieldset>
            <legend className="text-sm font-medium">¿Qué te gustaría lograr?</legend>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Podés elegir más de una opción.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {goals.map((goal) => (
                <label
                  key={goal}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm ${draft.goals.includes(goal) ? "border-[var(--color-primary)] bg-[var(--color-surface-accent)]" : "border-[var(--color-border)]"}`}
                >
                  <input
                    type="checkbox"
                    checked={draft.goals.includes(goal)}
                    onChange={(e) =>
                      update(
                        "goals",
                        e.target.checked
                          ? [...draft.goals, goal]
                          : draft.goals.filter((item) => item !== goal),
                      )
                    }
                  />
                  {goal}
                </label>
              ))}
            </div>
          </fieldset>
          <label className={labelClass}>
            ¿A quiénes querés llegar?
            <textarea
              className={inputClass}
              rows={3}
              value={draft.audience}
              onChange={(e) => update("audience", e.target.value)}
              placeholder="Ej.: restaurantes, cafeterías y personas que aman cocinar"
            />
          </label>
        </div>
      )}
      {step === 2 && (
        <div className="mt-5 grid gap-4">
          <label className={labelClass}>
            ¿Cómo te gustaría comunicarte?
            <select
              className={inputClass}
              value={draft.tone}
              onChange={(e) => update("tone", e.target.value)}
            >
              <option value="">Elegir más adelante</option>
              <option value="cercano">Cercano y conversado</option>
              <option value="profesional">Profesional y claro</option>
              <option value="inspirador">Inspirador y creativo</option>
              <option value="simple">Simple y directo</option>
            </select>
          </label>
          <label className={labelClass}>
            ¿Hay algo más que debamos saber sobre tu estilo?{" "}
            <span className="font-normal text-[var(--color-text-muted)]">(opcional)</span>
            <textarea
              className={inputClass}
              rows={3}
              value={draft.toneDetails}
              onChange={(e) => update("toneDetails", e.target.value)}
              placeholder="Ej.: usamos un tono cálido y evitamos palabras técnicas"
            />
          </label>
          <label className={labelClass}>
            ¿Cómo pueden contactarte?{" "}
            <span className="font-normal text-[var(--color-text-muted)]">(opcional)</span>
            <input
              className={inputClass}
              value={draft.contact}
              onChange={(e) => update("contact", e.target.value)}
              placeholder="WhatsApp, correo o sitio web"
            />
          </label>
          <label className={labelClass}>
            Instagram <span className="font-normal text-[var(--color-text-muted)]">(opcional)</span>
            <input
              className={inputClass}
              value={draft.instagram}
              onChange={(e) => update("instagram", e.target.value)}
              placeholder="Usuario o enlace"
            />
          </label>
          <p className="text-xs leading-5 text-[var(--color-text-muted)]">
            Agregar tu usuario es solo informativo: todavía no conecta ni analiza tu cuenta.
          </p>
        </div>
      )}
      {step === 3 && (
        <div className="mt-5 grid gap-5">
          <div>
            <p className="text-sm font-medium">
              Tu logo <span className="font-normal text-[var(--color-text-muted)]">(opcional)</span>
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              PNG, JPG o WebP · hasta 3 MB
            </p>
            <input
              aria-label="Cargar logo"
              className="mt-3 block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-[var(--color-border)] file:bg-[var(--color-surface)] file:px-3 file:py-2 file:text-[var(--color-text)]"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (
                  !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
                  file.size > 3 * 1024 * 1024
                ) {
                  setError("Elegí una imagen PNG, JPG o WebP de hasta 3 MB.");
                  e.target.value = "";
                  return;
                }
                setError("");
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") update("logo", reader.result);
                };
                reader.readAsDataURL(file);
              }}
            />
            {draft.logo && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={draft.logo}
                  alt="Vista previa del logo"
                  className="h-16 w-16 rounded-lg border border-[var(--color-border)] bg-white object-contain"
                />
                <button
                  type="button"
                  className="min-h-[44px] text-sm underline"
                  onClick={() => update("logo", null)}
                >
                  Quitar logo
                </button>
              </div>
            )}
          </div>
          <fieldset>
            <legend className="text-sm font-medium">
              Colores de tu marca{" "}
              <span className="font-normal text-[var(--color-text-muted)]">(podés cambiarlos)</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="color"
                  className="h-11 w-11 cursor-pointer"
                  value={draft.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                />
                Principal
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="color"
                  className="h-11 w-11 cursor-pointer"
                  value={draft.secondaryColor}
                  onChange={(e) => update("secondaryColor", e.target.value)}
                />
                Secundario
              </label>
            </div>
          </fieldset>
          <label className={labelClass}>
            Tipografía de tu marca{" "}
            <span className="font-normal text-[var(--color-text-muted)]">(opcional)</span>
            <input
              className={inputClass}
              value={draft.font}
              onChange={(e) => update("font", e.target.value)}
              placeholder="Nombre de la tipografía, si lo conocés"
            />
          </label>
          <div className="rounded-xl bg-[var(--color-surface-muted)] p-4 text-sm leading-6">
            ¿Todavía no tenés una identidad definida? Podés empezar con lo que tengas y, más
            adelante, solicitar ayuda de DOOH.
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
          className="min-h-[44px] rounded-xl border border-[var(--color-border)] px-4 text-sm font-semibold"
        >
          {step === 0 ? "Volver a la demo" : "Atrás"}
        </button>
        <button
          type="button"
          onClick={next}
          className="min-h-[44px] rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-[var(--color-text-on-primary)]"
        >
          {step === steps.length - 1 ? "Guardar perfil" : "Continuar"}
        </button>
      </div>
      <p className="mt-4 text-xs leading-5 text-[var(--color-text-muted)]">
        Demo: el perfil y los archivos se conservan solo durante esta sesión de página. Usá datos de
        prueba.
      </p>
    </section>
  );
}
