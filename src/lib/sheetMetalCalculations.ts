export type SheetMetalComplexity = "high" | "low";

/** Kolye tepeliği (bail) ek ağırlığı (g) */
export const PENDANT_BAIL_WEIGHT_G = 0.12;

/** Kolye zinciri ek ağırlığı (g) */
export const PENDANT_CHAIN_WEIGHT_G = 1.05;

/** Bileklik zinciri ek ağırlığı (g) */
export const BRACELET_CHAIN_WEIGHT_G = 0.75;

/**
 * Malzeme bazlı kerf ve cila katsayıları.
 * - 925 Gümüş: kalibre (7 gerçek parça, 0.40mm)
 * - 14 Ayar Altın: kerf (8 parça ortalaması), cila (7 parça ortalaması)
 * - Diğer altınlar: aynı kerf/cila, yoğunluk değişiyor
 */
const MATERIAL_FACTORS: Record<string, { kerf: number; finish: number }> = {
  "925-silver": { kerf: 0.954, finish: 0.946 },
  "8k-gold":    { kerf: 0.930, finish: 0.905 },
  "10k-gold":   { kerf: 0.930, finish: 0.905 },
  "14k-gold":   { kerf: 0.930, finish: 0.905 },
  "18k-gold":   { kerf: 0.930, finish: 0.905 },
  "22k-gold":   { kerf: 0.930, finish: 0.905 },
};

const DEFAULT_FACTORS = { kerf: 0.954, finish: 0.946 };

export function getMaterialFactors(materialId: string) {
  return MATERIAL_FACTORS[materialId] ?? DEFAULT_FACTORS;
}

export interface SheetMetalParams {
  areaMm2: number;
  thicknessMm: number;
  complexity: SheetMetalComplexity;
  materialDensity: number;
  materialId: string;
  includePendantBail?: boolean;
  includeBraceletChain?: boolean;
  includeCastEarringBack?: boolean;
  castEarringBackGrams?: number;
}

export interface SheetMetalResult {
  theoreticalG: number;
  afterLaserG: number;
  afterFinishG: number;
  finalProductG: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * 2D Lazer kesim astar ağırlık hesaplama.
 * Teorik ham → lazer kerf kaybı → cila/tesviye firesi.
 */
export function calculateSheetMetal(params: SheetMetalParams): SheetMetalResult {
  const {
    areaMm2,
    thicknessMm,
    materialDensity,
    materialId,
    includePendantBail = false,
    includeBraceletChain = false,
    includeCastEarringBack = false,
    castEarringBackGrams = 0,
  } = params;

  const { kerf, finish } = getMaterialFactors(materialId);

  const theoreticalG = (areaMm2 * thicknessMm * materialDensity) / 1000;
  const afterLaserG = theoreticalG * kerf;
  const afterFinishG = afterLaserG * finish;
  let finalProductG = afterFinishG;
  if (includePendantBail) finalProductG += PENDANT_BAIL_WEIGHT_G;
  if (includeBraceletChain) finalProductG += BRACELET_CHAIN_WEIGHT_G;
  if (includeCastEarringBack) finalProductG += castEarringBackGrams;

  return {
    theoreticalG: round2(theoreticalG),
    afterLaserG: round2(afterLaserG),
    afterFinishG: round2(afterFinishG),
    finalProductG: round2(finalProductG),
  };
}

export interface InverseSheetMetalResult extends SheetMetalResult {
  areaMm2: number;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/** Hedef final ağırlıktan gerekli alanı (mm²) hesaplar */
export function calculateAreaFromWeight(
  params: Omit<SheetMetalParams, "areaMm2"> & { targetFinalG: number }
): InverseSheetMetalResult | null {
  const {
    thicknessMm,
    materialDensity,
    materialId,
    targetFinalG,
    includePendantBail = false,
    includeBraceletChain = false,
    includeCastEarringBack = false,
    castEarringBackGrams = 0,
  } = params;

  if (thicknessMm <= 0 || materialDensity <= 0) return null;

  const { kerf, finish } = getMaterialFactors(materialId);
  if (kerf <= 0 || finish <= 0) return null;

  const bail = includePendantBail ? PENDANT_BAIL_WEIGHT_G : 0;
  const bracelet = includeBraceletChain ? BRACELET_CHAIN_WEIGHT_G : 0;
  const castBack = includeCastEarringBack ? castEarringBackGrams : 0;
  const afterFinishG = targetFinalG - bail - bracelet - castBack;

  if (afterFinishG <= 0) return null;

  const afterLaserG = afterFinishG / finish;
  const theoreticalG = afterLaserG / kerf;
  const areaMm2 = (theoreticalG * 1000) / (thicknessMm * materialDensity);

  if (areaMm2 <= 0) return null;

  const forward = calculateSheetMetal({
    ...params,
    areaMm2,
  });

  return {
    areaMm2: round4(areaMm2),
    ...forward,
  };
}
