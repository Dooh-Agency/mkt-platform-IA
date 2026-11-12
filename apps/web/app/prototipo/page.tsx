"use client";

import { useEffect, useRef, useState } from "react";
import { BusinessSetup, initialProfile } from "./perfil-negocio";

export default function PrototypePage() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("data-theme");
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    return () => {
      if (previous === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previous);
    };
  }, [theme]);
  const ideasRef = useRef<HTMLElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [showSetup, setShowSetup] = useState(true);
  const [name, setName] = useState(initialProfile.name);
  const [headline, setHeadline] = useState("Cerámica para la mesa");
  const [caption, setCaption] = useState(
    "Una propuesta de cerámica para acompañar experiencias gastronómicas.\n\nEscribinos para conocer más.",
  );
  const [media, setMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);
  const [layout, setLayout] = useState<"light" | "dark">("light");
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  const [ideas, setIdeas] = useState(true);
  const [analysisExample, setAnalysisExample] = useState(false);
  const [pieceName, setPieceName] = useState("");
  const [pieceDetail, setPieceDetail] = useState("");
  const [guided, setGuided] = useState(false);
  const [intent, setIntent] = useState<"producto" | "proceso" | "inspiracion">("producto");
  const [template, setTemplate] = useState<"photo" | "editorial" | "text">("photo");
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiNotice, setAiNotice] = useState(false);
  const [exploring, setExploring] = useState(true);
  const [textOptionIndex, setTextOptionIndex] = useState(0);
  const [textProposals, setTextProposals] = useState([
    {
      headline: "Una mesa con identidad",
      caption:
        "Cada mesa tiene una historia. Conocé nuestra propuesta de cerámica para espacios gastronómicos.",
      cta: "Escribinos para conocer más.",
    },
    {
      headline: "Pensado para gastronomía",
      caption: "Cerámica para acompañar la identidad de tu espacio y la experiencia en cada mesa.",
      cta: "Contanos qué estás buscando.",
    },
    {
      headline: "Cada pieza cuenta",
      caption: "Te invitamos a conocer el trabajo de Kanso en vajilla de gres para gastronomía.",
      cta: "Consultanos por nuestras piezas.",
    },
  ]);
  const intentDetails = {
    producto: {
      title: "Presentá una pieza",
      question: "¿Qué pieza querés mostrar?",
      placeholder: "Ej.: plato de gres",
      detail: "¿Qué querés destacar?",
      detailPlaceholder: "Ej.: su textura",
    },
    proceso: {
      title: "Mostrá tu proceso",
      question: "¿Qué parte del proceso querés mostrar?",
      placeholder: "Ej.: el esmaltado",
      detail: "¿Qué querés contar sobre esa etapa?",
      detailPlaceholder: "Ej.: cómo elegimos los colores",
    },
    inspiracion: {
      title: "Inspirá a un espacio gastronómico",
      question: "¿Qué propuesta querés compartir?",
      placeholder: "Ej.: una mesa para una cafetería",
      detail: "¿Qué te gustaría destacar?",
      detailPlaceholder: "Ej.: las piezas que elegiste",
    },
  } as const;
  function tryExampleProposals() {
    const subject = pieceName.trim();
    if (!subject) return;
    const extra = pieceDetail.trim();
    const detailLine = extra ? `\n\nPara destacar: ${extra}` : "";
    const sample = {
      producto: [
        {
          headline: subject,
          caption: `Una pieza para conocer: ${subject}.${detailLine}`,
          cta: "Escribinos para conocer más.",
        },
        {
          headline: "Una pieza para tu mesa",
          caption: `Te presentamos esta pieza: ${subject}.${detailLine}`,
          cta: "Contanos qué estás buscando.",
        },
        {
          headline: "Conocé nuestra vajilla",
          caption: `Hoy queremos mostrarte: ${subject}.${detailLine}`,
          cta: "Consultanos por esta pieza.",
        },
      ],
      proceso: [
        {
          headline: "Detrás de cada pieza",
          caption: `Te invitamos a conocer una etapa de nuestro proceso: ${subject}.${detailLine}`,
          cta: "¿Qué te gustaría saber sobre esta etapa?",
        },
        {
          headline: subject,
          caption: `Hoy compartimos parte de nuestro proceso: ${subject}.${detailLine}`,
          cta: "Dejanos tu pregunta.",
        },
        {
          headline: "Así trabajamos",
          caption: `Una mirada al proceso: ${subject}.${detailLine}`,
          cta: "Contanos qué te gustaría conocer.",
        },
      ],
      inspiracion: [
        {
          headline: "Una mesa con identidad",
          caption: `Una idea para compartir: ${subject}.${detailLine}`,
          cta: "Contanos qué estás imaginando.",
        },
        {
          headline: subject,
          caption: `Una propuesta para inspirarte: ${subject}.${detailLine}`,
          cta: "Escribinos y conversemos.",
        },
        {
          headline: "Inspiración para tu espacio",
          caption: `Hoy queremos compartir esta idea: ${subject}.${detailLine}`,
          cta: "¿Qué te parece esta propuesta?",
        },
      ],
    };
    setTextProposals(sample[intent]);
    setTextOptionIndex(0);
    setExploring(true);
    setPreview(false);
    setGuided(false);
    setNotice("Propuestas de ejemplo listas. Revisá los textos antes de usarlos.");
    requestAnimationFrame(() =>
      document
        .getElementById("publication")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }
  const backgroundColor = layout === "dark" ? profile.primaryColor : profile.secondaryColor;
  const components = [1, 3, 5].map(
    (offset) => Number.parseInt(backgroundColor.slice(offset, offset + 2), 16) / 255,
  );
  const luminance = components.reduce((sum, component, index) => {
    const linear = component <= 0.04045 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4;
    return sum + linear * ([0.2126, 0.7152, 0.0722][index] ?? 0);
  }, 0);
  const artworkTextColor =
    template === "photo" && media ? "#ffffff" : luminance > 0.179 ? "#000000" : "#ffffff";
  const currentProposal = textProposals[textOptionIndex];
  const shownHeadline = exploring && currentProposal ? currentProposal.headline : headline;
  const shownCaption =
    exploring && currentProposal ? `${currentProposal.caption}\n\n${currentProposal.cta}` : caption;
  const examples = [
    {
      title: "Presentá una pieza",
      detail: "Mostrá una pieza de gres a restaurantes, hoteles o cafeterías.",
      headline: "Una pieza, muchas mesas",
      caption: "Conocé una propuesta de cerámica pensada para la experiencia en la mesa.",
      cta: "Escribinos para conocer más.",
    },
    {
      title: "Mostrá tu proceso",
      detail: "Compartí una etapa del trabajo detrás de una pieza.",
      headline: "Detrás de cada pieza",
      caption: "Te invitamos a conocer una parte del proceso de creación de nuestra cerámica.",
      cta: "¿Qué te gustaría saber sobre nuestro trabajo?",
    },
    {
      title: "Inspirá a un espacio gastronómico",
      detail: "Proponé una idea para presentar una pieza en contexto.",
      headline: "Cerámica para una mesa con identidad",
      caption: "La cerámica puede acompañar la identidad de una propuesta gastronómica.",
      cta: "Contanos qué estás imaginando para tu espacio.",
    },
  ];

  if (showSetup) {
    return (
      <main className="demo-design min-h-screen bg-[var(--color-background)] px-4 py-8 text-[var(--color-text)]">
        <div className="mx-auto mb-6 max-w-2xl text-sm font-semibold text-[var(--color-text-muted)]">
          DOOH · Configuración de ejemplo
        </div>
        <BusinessSetup
          initial={{ ...profile, name }}
          onClose={() => setShowSetup(false)}
          onSave={(next) => {
            setProfile(next);
            setName(next.name);
            setShowSetup(false);
            setNotice(
              "Perfil actualizado para esta sesión. Algunas preferencias todavía no modifican las propuestas de ejemplo.",
            );
          }}
        />
      </main>
    );
  }

  return (
    <main className="demo-design min-h-screen bg-[var(--color-background)] px-4 py-8 text-[var(--color-text)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)]">
              DOOH <span aria-hidden="true">/</span> Mi negocio
            </p>
            <label htmlFor="business" className="sr-only">
              Nombre del negocio
            </label>
            <input
              id="business"
              aria-label="Nombre del negocio"
              className="mt-1 w-full max-w-[240px] bg-transparent text-2xl font-semibold leading-tight outline-offset-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="min-h-[44px] rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium"
              onClick={() => setShowSetup(true)}
            >
              Mi perfil
            </button>
            <details className="relative shrink-0 text-sm">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 font-medium">
                Opciones <span aria-hidden="true">⌄</span>
              </summary>
              <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-lg">
                <label
                  htmlFor="theme"
                  className="block text-xs font-medium text-[var(--color-text-muted)]"
                >
                  Tema
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as "system" | "light" | "dark")}
                  className="mt-2 min-h-[44px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)]"
                >
                  <option value="system">Del dispositivo</option>
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>
                <a href="/" className="mt-4 block text-sm underline">
                  Ir a la demo técnica
                </a>
              </div>
            </details>
          </div>
        </header>
        <p className="mb-6 text-xs leading-5 text-[var(--color-text-muted)]">
          Vista de prueba · Los cambios no se guardan ni se publican. Usá datos ficticios.
        </p>
        <section
          className="mb-8 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-5 shadow-sm"
          aria-labelledby="network-heading"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-lg">
              <p className="text-xs font-medium text-[var(--color-text-muted)]">Tu asistente</p>
              <h2 id="network-heading" className="mt-1 text-lg font-semibold">
                Próxima acción para tu negocio
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Recibí ideas para comunicar y conectar con tus clientes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAnalysisExample(true)}
              className="min-h-[44px] rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-text-on-primary)]"
            >
              ✦ Analizar mi red
            </button>
          </div>
          {analysisExample && (
            <div className="mt-5 border-t border-[var(--color-border-subtle)] pt-4">
              <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                Sugerencia de ejemplo
              </p>
              <h3 className="mt-2 font-semibold">Mostrá una pieza a tus posibles clientes</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                Podrías presentar una pieza y contar cómo acompaña la experiencia de una mesa
                gastronómica.
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
                Ejemplo editorial para Kanso: tu cuenta todavía no está conectada ni fue analizada.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIntent("producto");
                    setPieceName("");
                    setPieceDetail("");
                    setGuided(true);
                    setAnalysisExample(false);
                    requestAnimationFrame(() =>
                      document
                        .getElementById("guided-form")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                    );
                  }}
                  className="min-h-[44px] rounded-xl bg-[var(--color-primary)] px-4 text-sm font-semibold text-[var(--color-text-on-primary)]"
                >
                  Preparar publicación
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysisExample(false)}
                  className="min-h-[44px] px-2 text-sm font-medium underline"
                >
                  Ahora no
                </button>
              </div>
            </div>
          )}
        </section>
        <section className="mb-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[var(--color-text-muted)]">
                Ideas para tu negocio · ejemplos
              </p>
              <h2 className="mt-1 text-xl font-semibold leading-tight">
                ¿Qué podés comunicar hoy?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIdeas(!ideas)}
              className="min-h-[44px] shrink-0 text-sm font-medium text-[var(--color-text-muted)] underline"
            >
              {ideas ? "Ocultar" : "Ver ideas"}
            </button>
          </div>
          {ideas && (
            <div>
              <section
                ref={ideasRef}
                aria-label="Ideas para tu negocio; desplazate horizontalmente"
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
              >
                {examples.map((idea) => (
                  <article
                    key={idea.title}
                    className="w-[82%] min-w-0 shrink-0 snap-start rounded-2xl bg-[var(--color-surface-accent)] p-4 sm:w-[calc((100%-1.5rem)/3)]"
                  >
                    <h3 className="font-semibold">{idea.title}</h3>
                    <p className="mt-2 text-sm leading-5 text-[var(--color-text-muted)]">
                      {idea.detail}
                    </p>
                    <button
                      type="button"
                      className="mt-3 inline-flex min-h-[44px] items-center text-sm font-semibold"
                      onClick={() => {
                        setIntent(
                          idea.title === "Presentá una pieza"
                            ? "producto"
                            : idea.title === "Mostrá tu proceso"
                              ? "proceso"
                              : "inspiracion",
                        );
                        setPieceName("");
                        setPieceDetail("");
                        setGuided(true);
                        setNotice("");
                      }}
                    >
                      Probar esta idea →
                    </button>
                  </article>
                ))}
              </section>
              <div className="mt-1 flex items-center justify-between gap-3 sm:hidden">
                <p className="text-xs text-[var(--color-text-muted)]">Deslizá para ver más</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Ideas anteriores"
                    onClick={() => ideasRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-[var(--color-text)]"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Ideas siguientes"
                    onClick={() => ideasRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-[var(--color-text)]"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
        {guided && (
          <section
            id="guided-form"
            className="mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                  Primer paso · {intentDetails[intent].title}
                </p>
                <h2 className="mt-2 text-xl font-semibold">Contanos qué querés mostrar</h2>
              </div>
              <button type="button" onClick={() => setGuided(false)} className="text-sm underline">
                Cerrar
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
              Contanos qué querés mostrar y prepararemos propuestas para tu publicación.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                {intentDetails[intent].question}
                <input
                  maxLength={200}
                  value={pieceName}
                  onChange={(e) => setPieceName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-normal text-[var(--color-text)]"
                  placeholder={intentDetails[intent].placeholder}
                />
              </label>
              <label className="block text-sm font-medium">
                {intentDetails[intent].detail}{" "}
                <span className="font-normal text-[var(--color-text-muted)]">(opcional)</span>
                <input
                  maxLength={400}
                  value={pieceDetail}
                  onChange={(e) => setPieceDetail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-normal text-[var(--color-text)]"
                  placeholder={intentDetails[intent].detailPlaceholder}
                />
              </label>
            </div>
            <button
              type="button"
              disabled={!pieceName.trim()}
              className="mt-4 min-h-[44px] rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-text-on-primary)] disabled:opacity-40"
              onClick={tryExampleProposals}
            >
              Generar propuestas
            </button>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Podrás revisar y elegir una propuesta; no se publica automáticamente.
            </p>
          </section>
        )}
        <div>
          <section
            id="publication"
            aria-label="Publicación de ejemplo"
            className="mx-auto w-full max-w-[470px]"
          >
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {preview ? "Vista previa" : "Tu publicación"}
                </h2>
                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                  {preview
                    ? "Así podría verse tu publicación."
                    : "Elegí una propuesta y personalizala."}
                </p>
              </div>
              <span className="shrink-0 text-xs text-[var(--color-text-muted)]">Ejemplo</span>
            </div>
            <article className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-sm">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-accent)] text-sm font-bold">
                  {profile.logo ? (
                    <img
                      src={profile.logo}
                      alt={`Logo de ${name}`}
                      className="h-full w-full rounded-full bg-white object-contain"
                    />
                  ) : (
                    name.trim().charAt(0).toUpperCase() || "N"
                  )}
                </span>
                <span className="text-sm font-semibold">{name || "Tu negocio"}</span>
              </div>
              <div
                className="relative aspect-[4/5] overflow-hidden"
                style={{
                  backgroundColor:
                    layout === "dark" ? profile.primaryColor : profile.secondaryColor,
                }}
              >
                {media &&
                  template !== "text" &&
                  (media.type === "video" ? (
                    // biome-ignore lint/a11y/useMediaCaption: Video local de prueba; el prototipo no dispone de subtítulos.
                    <video
                      src={media.url}
                      controls
                      className={
                        template === "editorial"
                          ? "h-[60%] w-full object-cover"
                          : "h-full w-full object-cover"
                      }
                      aria-label="Video de la publicación"
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt="Imagen de la publicación"
                      className={
                        template === "editorial"
                          ? "h-[60%] w-full object-cover"
                          : "h-full w-full object-cover"
                      }
                    />
                  ))}
                {media && template === "photo" && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/10" />
                )}
                {!preview && (
                  <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-2">
                    <button
                      type="button"
                      aria-label="Herramientas de imagen con IA, próximamente"
                      aria-describedby={aiNotice ? "ai-image-notice" : undefined}
                      onClick={() => setAiNotice(!aiNotice)}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-xl text-[#294f3f] shadow"
                    >
                      ✦
                    </button>
                    {aiNotice && (
                      <output
                        id="ai-image-notice"
                        className="max-w-[220px] rounded-lg bg-white px-3 py-2 text-sm text-[#24332f] shadow"
                      >
                        Esta función estará disponible próximamente.
                      </output>
                    )}
                  </div>
                )}
                {!preview && template !== "text" && (
                  <button
                    type="button"
                    onClick={() => mediaInputRef.current?.click()}
                    className="absolute bottom-4 right-4 z-10 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#24332f] shadow"
                  >
                    {media ? "Cambiar imagen o video" : "+ Agregar imagen o video"}
                  </button>
                )}
                <input
                  id="media"
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (
                      file &&
                      (file.type.startsWith("image/") || file.type.startsWith("video/"))
                    ) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string")
                          setMedia({
                            url: reader.result,
                            type: file.type.startsWith("video/") ? "video" : "image",
                          });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <div
                  className={`absolute left-[8%] right-[8%] ${template === "editorial" ? "top-[65%]" : template === "text" ? "top-[25%]" : "top-[12%]"}`}
                  style={{ color: artworkTextColor }}
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest">
                    {name || "Tu negocio"}
                  </p>
                  {preview ? (
                    <p className="whitespace-pre-wrap text-3xl font-bold leading-tight sm:text-4xl">
                      {shownHeadline}
                    </p>
                  ) : (
                    <textarea
                      aria-label="Texto dentro de la imagen o video"
                      rows={3}
                      className="w-full resize-none rounded bg-transparent text-3xl font-bold leading-tight outline-offset-4 placeholder:text-white/80 sm:text-4xl"
                      value={shownHeadline}
                      readOnly={exploring}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Escribí el texto de la pieza"
                    />
                  )}
                </div>
              </div>
              {!preview && (
                <div className="border-b border-[var(--color-border-subtle)] px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setShowTemplates(!showTemplates)}
                    aria-expanded={showTemplates}
                    className="text-sm font-semibold underline"
                  >
                    {showTemplates ? "Cerrar diseños" : "Cambiar diseño"}
                  </button>
                  {showTemplates && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs text-[var(--color-text-muted)]">
                        Elegí una composición. Tu imagen y tus textos se conservan.
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { id: "photo", label: "Foto protagonista" },
                            { id: "editorial", label: "Foto y color" },
                            { id: "text", label: "Placa de texto" },
                          ] as const
                        ).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            aria-pressed={template === item.id}
                            onClick={() => setTemplate(item.id)}
                            className={`rounded-lg border p-2 text-left text-xs ${template === item.id ? "border-[var(--color-primary)] bg-[var(--color-surface-accent)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}
                          >
                            <span
                              aria-hidden="true"
                              className={`mb-2 block h-12 rounded ${item.id === "photo" ? "bg-[#a6b3a5]" : item.id === "editorial" ? "bg-gradient-to-b from-[#a6b3a5] from-60% to-[#c58d74] to-60%" : "bg-[#c58d74]"}`}
                            />
                            {item.label}
                          </button>
                        ))}
                      </div>
                      {template === "text" && media && (
                        <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                          Esta composición no muestra tu imagen o video. Se conserva si volvés a
                          otro diseño.
                        </p>
                      )}
                      {(template !== "photo" || !media) && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs font-medium">Color de fondo · tu marca</p>
                          <div className="flex gap-2">
                            {(["light", "dark"] as const).map((option) => (
                              <button
                                key={option}
                                type="button"
                                aria-pressed={layout === option}
                                onClick={() => setLayout(option)}
                                className={`rounded-full border px-3 py-2 text-xs ${layout === option ? "border-[var(--color-primary)] bg-[var(--color-surface-accent)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}
                              >
                                {option === "light" ? "Secundario" : "Principal"}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="px-4 pb-5 pt-4">
                {!preview && !exploring && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    Texto de la publicación
                  </p>
                )}
                {preview ? (
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    <strong>{name || "Tu negocio"}</strong> {shownCaption}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {!exploring && (
                      <label className="block">
                        <span className="sr-only">Texto que acompaña la publicación</span>
                        <textarea
                          rows={6}
                          className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm leading-6 text-[var(--color-text)] focus:border-[var(--color-focus)] focus:outline-none"
                          value={shownCaption}
                          readOnly={exploring}
                          onChange={(e) => setCaption(e.target.value)}
                          placeholder="Escribí el mensaje de tu publicación"
                        />
                      </label>
                    )}
                    {!exploring && (
                      <button
                        type="button"
                        className="text-sm font-semibold underline"
                        onClick={() => setExploring(true)}
                      >
                        Ver otras propuestas
                      </button>
                    )}
                    {exploring && (
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-medium text-[var(--color-text-muted)]">
                            Propuesta {textOptionIndex + 1} de {textProposals.length}
                          </p>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              aria-label="Propuesta anterior"
                              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-lg"
                              onClick={() =>
                                setTextOptionIndex(
                                  (textOptionIndex + textProposals.length - 1) %
                                    textProposals.length,
                                )
                              }
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              aria-label="Propuesta siguiente"
                              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-lg"
                              onClick={() =>
                                setTextOptionIndex((textOptionIndex + 1) % textProposals.length)
                              }
                            >
                              →
                            </button>
                          </div>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                          {currentProposal?.caption}
                          {"\n\n"}
                          {currentProposal?.cta}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="min-h-[44px] rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text-on-primary)]"
                            onClick={() => {
                              const proposal = textProposals[textOptionIndex];
                              if (!proposal) return;
                              setHeadline(proposal.headline);
                              setCaption(`${proposal.caption}\n\n${proposal.cta}`);
                              setExploring(false);
                              setNotice("Propuesta seleccionada. Podés seguir editándola.");
                            }}
                          >
                            Usar esta propuesta
                          </button>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <button
                            type="button"
                            className="min-h-[44px] text-sm font-medium text-[var(--color-text-muted)] underline"
                            onClick={() => setExploring(false)}
                          >
                            Volver a mi versión
                          </button>
                          <button
                            type="button"
                            className="min-h-[44px] text-sm font-medium text-[var(--color-text-muted)] underline"
                            onClick={() => {
                              setGuided(true);
                            }}
                          >
                            Generar otras propuestas
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
            {!preview && notice && (
              <output className="mt-3 block rounded-lg bg-[var(--color-surface)] p-3 text-sm leading-5 text-[var(--color-text-muted)]">
                {notice}
              </output>
            )}
            <button
              type="button"
              onClick={() => {
                setPreview(!preview);
                setShowTemplates(false);
                setAiNotice(false);
              }}
              className="mt-4 min-h-[48px] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-text)]"
            >
              {preview ? "Volver a editar" : "Ver publicación"}
            </button>
            <p className="mt-3 text-xs leading-5 text-[var(--color-text-muted)]">
              Vista inspirada en una publicación de redes sociales. La apariencia final puede variar
              según la red y el dispositivo.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
