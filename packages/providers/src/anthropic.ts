import Anthropic from "@anthropic-ai/sdk";
import type { GenerateTextInput, GenerateTextOutput, TextGenerationProvider } from "./types.js";

const DEFAULT_MODEL = "claude-sonnet-5";
const DEFAULT_MAX_TOKENS = 1024;

export interface AnthropicProviderConfig {
  apiKey?: string;
  model?: string;
}

/**
 * Proveedor de generación de texto por defecto (ver ADR 0001).
 * Implementa TextGenerationProvider — se puede reemplazar sin tocar
 * packages/core ni los agentes que lo consumen.
 */
export class AnthropicTextProvider implements TextGenerationProvider {
  readonly name = "anthropic";

  private readonly client: Anthropic;
  private readonly model: string;

  constructor(config: AnthropicProviderConfig = {}) {
    const apiKey = config.apiKey ?? process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY no está configurada");
    }
    this.client = new Anthropic({ apiKey });
    this.model = config.model ?? DEFAULT_MODEL;
  }

  async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: input.maxTokens ?? DEFAULT_MAX_TOKENS,
      messages: [{ role: "user", content: input.prompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("La respuesta del proveedor no contiene texto");
    }

    return { text: textBlock.text, model: this.model };
  }
}
