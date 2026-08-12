/**
 * Gate de QA (ver docs/architecture.md §3 y §5): ningún ContentPiece pasa a
 * estados posteriores a "draft" sin aprobar estas validaciones. En Fase 1
 * son reglas simples; se amplían por tipo de contenido en Fase 2.
 */
export interface QaCheckInput {
  title: string;
  body: string | null;
}

export interface QaResult {
  passed: boolean;
  reasons: string[];
}

const MIN_BODY_LENGTH = 20;
const MAX_BODY_LENGTH = 5000;

export function runQaGate(input: QaCheckInput): QaResult {
  const reasons: string[] = [];

  if (!input.title.trim()) {
    reasons.push("El título está vacío");
  }
  if (!input.body || input.body.trim().length < MIN_BODY_LENGTH) {
    reasons.push(`El contenido tiene menos de ${MIN_BODY_LENGTH} caracteres`);
  }
  if (input.body && input.body.length > MAX_BODY_LENGTH) {
    reasons.push(`El contenido supera los ${MAX_BODY_LENGTH} caracteres`);
  }

  return { passed: reasons.length === 0, reasons };
}
