import { describe, expect, it } from "vitest";
import type { TextGenerationProvider } from "@dooh/providers";
import { ToolRegistry } from "../tool-registry.js";
import {
  TEXT_GENERATION_TOOL_NAME,
  createTextGenerationTool,
} from "../tools/text-generation.js";

describe("createTextGenerationTool", () => {
  it("registra y ejecuta el proveedor sin exponerlo al consumidor", async () => {
    const provider: TextGenerationProvider = {
      name: "fake",
      generateText: async ({ prompt }) => ({
        text: `Respuesta: ${prompt}`,
        model: "fake-model",
      }),
    };
    const registry = new ToolRegistry();
    registry.register(createTextGenerationTool(provider));

    const result = await registry.get(TEXT_GENERATION_TOOL_NAME).run({ prompt: "Hola" });

    expect(result).toEqual({ text: "Respuesta: Hola", model: "fake-model" });
  });

  it("rechaza una entrada inválida", async () => {
    const provider: TextGenerationProvider = {
      name: "fake",
      generateText: async () => ({ text: "No debería ejecutarse", model: "fake-model" }),
    };

    await expect(createTextGenerationTool(provider).run({})).rejects.toThrow(
      "La herramienta generate_text requiere un prompt válido",
    );
  });
});
