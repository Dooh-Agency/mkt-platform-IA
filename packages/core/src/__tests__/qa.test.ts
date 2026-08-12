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
});
