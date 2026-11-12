"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const colorTokens = [
  { name: "Fondo", token: "--color-background" },
  { name: "Superficie", token: "--color-surface" },
  { name: "Superficie de acento", token: "--color-surface-accent" },
  { name: "Acción principal", token: "--color-primary" },
  { name: "Texto principal", token: "--color-text" },
  { name: "Texto secundario", token: "--color-text-muted" },
];

export default function DesignSystemPreview() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("data-theme");
    root.setAttribute("data-theme", theme);
    return () => {
      if (previous === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previous);
    };
  }, [theme]);

  return (
    <main
      style={{
        background: "var(--color-background)",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
        minHeight: "100vh",
        padding: "var(--space-6) var(--space-4)",
      }}
    >
      <div style={{ maxWidth: "var(--content-width-app)", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
          }}
        >
          <div>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-small)" }}>
              DOOH · Vista de diseño
            </p>
            <h1
              style={{
                fontSize: "var(--font-size-heading-lg)",
                fontWeight: "var(--font-weight-semibold)",
                lineHeight: "var(--line-height-tight)",
                marginTop: "var(--space-2)",
              }}
            >
              Una interfaz clara y cercana
            </h1>
          </div>
          <div aria-label="Tema de la muestra" style={{ display: "flex", gap: "var(--space-2)" }}>
            {(["light", "dark"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTheme(option)}
                aria-pressed={theme === option}
                style={{
                  minHeight: "var(--size-touch-target)",
                  padding: "0 var(--space-4)",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--color-border)",
                  background: theme === option ? "var(--color-primary)" : "var(--color-surface)",
                  color: theme === option ? "var(--color-text-on-primary)" : "var(--color-text)",
                  fontWeight: 600,
                }}
              >
                {option === "light" ? "☀ Claro" : "☾ Oscuro"}
              </button>
            ))}
          </div>
        </header>
        <p
          style={{
            color: "var(--color-text-muted)",
            lineHeight: "var(--line-height-normal)",
            marginBottom: "var(--space-8)",
          }}
        >
          Una muestra de la paleta y los componentes propuestos para la aplicación. Los colores y la
          identidad de cada negocio se aplicarán por separado a sus publicaciones.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "var(--space-6)",
          }}
        >
          <section
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--font-size-small)",
                fontWeight: 600,
              }}
            >
              EJEMPLO DE INTERFAZ
            </p>
            <h2
              style={{
                fontSize: "var(--font-size-heading-md)",
                fontWeight: 600,
                marginTop: "var(--space-2)",
              }}
            >
              ¿Qué querés comunicar hoy?
            </h2>
            <p
              style={{
                marginTop: "var(--space-2)",
                lineHeight: "var(--line-height-normal)",
                color: "var(--color-text-muted)",
              }}
            >
              Elegí una idea para preparar tu próxima publicación.
            </p>
            <div
              style={{
                background: "var(--color-surface-accent)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-4)",
                marginTop: "var(--space-5)",
              }}
            >
              <h3 style={{ fontWeight: 600 }}>Mostrá una pieza</h3>
              <p style={{ marginTop: "var(--space-2)", lineHeight: "var(--line-height-normal)" }}>
                Presentá tu trabajo a nuevos clientes.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-3)",
                marginTop: "var(--space-5)",
              }}
            >
              <button
                type="button"
                style={{
                  minHeight: "var(--size-touch-target)",
                  background: "var(--color-primary)",
                  color: "var(--color-text-on-primary)",
                  padding: "0 var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 600,
                }}
              >
                Preparar publicación
              </button>
              <button
                type="button"
                style={{
                  minHeight: "var(--size-touch-target)",
                  border: "1px solid var(--color-border)",
                  padding: "0 var(--space-4)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                Ver otras ideas
              </button>
            </div>
          </section>
          <section
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h2 style={{ fontSize: "var(--font-size-heading-sm)", fontWeight: 600 }}>
              Colores de la interfaz
            </h2>
            <p
              style={{
                color: "var(--color-text-muted)",
                marginTop: "var(--space-2)",
                fontSize: "var(--font-size-small)",
              }}
            >
              Cambiá entre claro y oscuro para compararlos.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "var(--space-3)",
                marginTop: "var(--space-5)",
              }}
            >
              {colorTokens.map((color) => (
                <div key={color.token}>
                  <div
                    style={{
                      height: "64px",
                      background: `var(${color.token})`,
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  />
                  <p
                    style={{
                      marginTop: "var(--space-2)",
                      fontSize: "var(--font-size-small)",
                      fontWeight: 500,
                    }}
                  >
                    {color.name}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
            }}
          >
            <h2 style={{ fontSize: "var(--font-size-heading-sm)", fontWeight: 600 }}>
              Tipografía y jerarquía
            </h2>
            <p
              style={{
                fontSize: "var(--font-size-heading-md)",
                fontWeight: 600,
                marginTop: "var(--space-4)",
              }}
            >
              Un título fácil de leer
            </p>
            <p
              style={{
                fontSize: "var(--font-size-body)",
                marginTop: "var(--space-2)",
                lineHeight: "var(--line-height-normal)",
              }}
            >
              El texto principal usa una tipografía del sistema, clara y adaptable al dispositivo.
            </p>
            <p
              style={{
                fontSize: "var(--font-size-small)",
                color: "var(--color-text-muted)",
                marginTop: "var(--space-2)",
              }}
            >
              Información secundaria y ayudas breves.
            </p>
          </section>
          <section
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
            }}
          >
            <h2 style={{ fontSize: "var(--font-size-heading-sm)", fontWeight: 600 }}>
              Mensajes y estados
            </h2>
            <div style={{ display: "grid", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
              {[
                {
                  text: "✓ Cambios guardados",
                  foreground: "--color-success",
                  background: "--color-success-surface",
                },
                {
                  text: "! Revisá la información",
                  foreground: "--color-warning",
                  background: "--color-warning-surface",
                },
                {
                  text: "× No se pudo guardar",
                  foreground: "--color-danger",
                  background: "--color-danger-surface",
                },
                {
                  text: "i Hay una nueva sugerencia",
                  foreground: "--color-info",
                  background: "--color-info-surface",
                },
              ].map((item) => (
                <p
                  key={item.text}
                  style={{
                    color: `var(${item.foreground})`,
                    background: `var(${item.background})`,
                    padding: "var(--space-3)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--font-size-small)",
                    fontWeight: 500,
                  }}
                >
                  {item.text}
                </p>
              ))}
            </div>
          </section>
        </div>
        <p
          style={{
            marginTop: "var(--space-8)",
            fontSize: "var(--font-size-small)",
            color: "var(--color-text-muted)",
          }}
        >
          Vista de referencia. El prototipo de publicaciones todavía no usa todos estos estilos ni
          cuenta con modo oscuro completo.
        </p>
        <a
          href="/prototipo"
          style={{
            display: "inline-block",
            marginTop: "var(--space-3)",
            color: "var(--color-text)",
            textDecoration: "underline",
          }}
        >
          Volver al prototipo
        </a>
      </div>
    </main>
  );
}
