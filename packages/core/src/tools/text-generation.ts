import type { GenerateTextInput, TextGenerationProvider } from "@dooh/providers";
import type { Tool } from "../tool-registry.js";

export const TEXT_GENERATION_TOOL_NAME = "generate_text";

/**
 * Adaptador de proveedor al registro propio de herramientas. El pipeline conoce
 * el nombre de la herramienta, nunca la implementación ni el SDK del proveedor.
 */
export function createTextGenerationTool(provider: TextGenerationProvider): Tool {
  return {
    name: TEXT_GENERATION_TOOL_NAME,
    description: "Genera contenido escrito a partir de una instrucción",
    async run(input) {
      if (!isGenerateTextInput(input)) {
        throw new Error("La herramienta generate_text requiere un prompt válido");
      }
      return provider.generateText(input);
    },
  };
}

function isGenerateTextInput(input: unknown): input is GenerateTextInput {
  return (
    typeof input === "object" &&
    input !== null &&
    "prompt" in input &&
    typeof input.prompt === "string" &&
    input.prompt.trim().length > 0
  );
}
