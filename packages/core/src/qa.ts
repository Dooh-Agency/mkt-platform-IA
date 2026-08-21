/**
 * Gate de QA (ver docs/architecture.md §3 y §5): ningún ContentPiece pasa a
 * estados posteriores a "draft" sin aprobar estas validaciones. En Fase 1
 * son reglas simples; se amplían por tipo de contenido en Fase 2.
 */
export interface QaCheckInput {
  type?: QaContentType;
  title: string;
  body: string | null;
  assetUrl?: string | null;
}

export interface QaResult {
  passed: boolean;
  reasons: string[];
}

export type QaContentType =
  | "text"
  | "article"
  | "video_long"
  | "video_short"
  | "carousel"
  | "image"
  | "newsletter"
  | "lead_magnet"
  | "social_post";

interface QaRule {
  minBodyLength: number;
  maxBodyLength?: number;
  requiresAsset?: boolean;
}

const QA_RULES: Record<QaContentType, QaRule> = {
  text: { minBodyLength: 20, maxBodyLength: 5000 },
  article: { minBodyLength: 250, maxBodyLength: 15000 },
  video_long: { minBodyLength: 250, requiresAsset: true },
  video_short: { minBodyLength: 80, requiresAsset: true },
  carousel: { minBodyLength: 80, requiresAsset: true },
  image: { minBodyLength: 10, requiresAsset: true },
  newsletter: { minBodyLength: 250, maxBodyLength: 10000 },
  lead_magnet: { minBodyLength: 500, requiresAsset: true },
  social_post: { minBodyLength: 20, maxBodyLength: 2200 },
};

export function runQaGate(input: QaCheckInput): QaResult {
  const reasons: string[] = [];
  const type = input.type ?? "text";
  const rules = QA_RULES[type];

  if (!input.title.trim()) {
    reasons.push("El título está vacío");
  }
  if (!input.body || input.body.trim().length < rules.minBodyLength) {
    reasons.push(`El contenido tiene menos de ${rules.minBodyLength} caracteres`);
  }
  if (input.body && rules.maxBodyLength && input.body.length > rules.maxBodyLength) {
    reasons.push(`El contenido supera los ${rules.maxBodyLength} caracteres`);
  }
  if (rules.requiresAsset && !input.assetUrl?.trim()) {
    reasons.push(`El tipo ${type} requiere un asset antes de aprobarse`);
  }

  return { passed: reasons.length === 0, reasons };
}
