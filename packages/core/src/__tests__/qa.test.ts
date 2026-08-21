import { describe, expect, it } from "vitest";
import { runQaGate } from "../qa.js";

describe("runQaGate", () => {
  it("rechaza título vacío", () => {
    const result = runQaGate({ title: "  ", body: "a".repeat(30) });
    expect(result.passed).toBe(false);
    expect(result.reasons).toContain("El título está vacío");
  });

  it("rechaza contenido demasiado corto", () => {
    const result = runQaGate({ title: "Título", body: "muy corto" });
    expect(result.passed).toBe(false);
  });

  it("aprueba contenido válido", () => {
    const result = runQaGate({ title: "Título", body: "a".repeat(30) });
    expect(result.passed).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it("aplica un mínimo mayor a los artículos", () => {
    const result = runQaGate({
      type: "article",
      title: "Título",
      body: "a".repeat(100),
    });
    expect(result.passed).toBe(false);
    expect(result.reasons).toContain("El contenido tiene menos de 250 caracteres");
  });

  it("requiere asset para una imagen", () => {
    const result = runQaGate({
      type: "image",
      title: "Promo",
      body: "Café y algo dulce",
    });
    expect(result.passed).toBe(false);
    expect(result.reasons).toContain("El tipo image requiere un asset antes de aprobarse");
  });

  it("limita la extensión de los posts sociales", () => {
    const result = runQaGate({
      type: "social_post",
      title: "Promo",
      body: "a".repeat(2201),
    });
    expect(result.passed).toBe(false);
    expect(result.reasons).toContain("El contenido supera los 2200 caracteres");
  });
});
