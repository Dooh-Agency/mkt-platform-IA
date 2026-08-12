/**
 * Registro de herramientas disponibles para los agentes (ver docs/architecture.md §1).
 * Los agentes declaran qué herramientas necesitan por nombre; este registro decide
 * qué implementación concreta corresponde, sin acoplar al agente a un SDK de proveedor.
 */
export interface Tool<TInput = unknown, TOutput = unknown> {
  name: string;
  description: string;
  run: (input: TInput) => Promise<TOutput>;
}

export class ToolRegistry {
  private readonly tools = new Map<string, Tool>();

  register(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`La herramienta "${tool.name}" ya está registrada`);
    }
    this.tools.set(tool.name, tool);
  }

  get(name: string): Tool {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Herramienta "${name}" no encontrada en el registro`);
    }
    return tool;
  }

  list(): Tool[] {
    return [...this.tools.values()];
  }
}
