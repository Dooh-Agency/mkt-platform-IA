/**
 * Interfaz que deben cumplir todos los proveedores de generación de texto.
 * Ver ADR 0001: los proveedores de IA son intercambiables — el resto del
 * sistema (packages/core, agentes) depende de esta interfaz, nunca del SDK
 * de un proveedor específico.
 */
export interface TextGenerationProvider {
  readonly name: string;
  generateText(input: GenerateTextInput): Promise<GenerateTextOutput>;
}

export interface GenerateTextInput {
  prompt: string;
  maxTokens?: number;
}

export interface GenerateTextOutput {
  text: string;
  model: string;
}
