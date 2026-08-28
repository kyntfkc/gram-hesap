export type SheetMetalComplexity = "high" | "low";

import {
  BRACELET_CHAIN_G,
  CAST_EARRING_BACK_G,
  PENDANT_BAIL_2D_G,
  PENDANT_CHAIN_G,
} from "./weightConstants";

/** Astar kesim kolye tepeliği (bail) ek ağırlığı (g) */
export const PENDANT_BAIL_WEIGHT_G = PENDANT_BAIL_2D_G;

/** Kolye zinciri ek ağırlığı (g) */
export const PENDANT_CHAIN_WEIGHT_G = PENDANT_CHAIN_G;

/** Bileklik zinciri ek ağırlığı (g) */
export const BRACELET_CHAIN_WEIGHT_G = BRACELET_CHAIN_G;

/** Döküm küpe arkalığı ek ağırlığı (g) */
export const CAST_EARRING_BACK_WEIGHT_G = CAST_EARRING_BACK_G;

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
  includePendantChain?: boolean;
  includeBraceletChain?: boolean;
  includeCastEarringBack?: boolean;
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
    includePendantChain = false,
    includeBraceletChain = false,
    includeCastEarringBack = false,
  } = params;

  const { kerf, finish } = getMaterialFactors(materialId);

  const theoreticalG = (areaMm2 * thicknessMm * materialDensity) / 1000;
  const afterLaserG = theoreticalG * kerf;
  const afterFinishG = afterLaserG * finish;
  let finalProductG = afterFinishG;
  if (includePendantBail) finalProductG += PENDANT_BAIL_WEIGHT_G;
  if (includePendantChain) finalProductG += PENDANT_CHAIN_WEIGHT_G;
  if (includeBraceletChain) finalProductG += BRACELET_CHAIN_WEIGHT_G;
  if (includeCastEarringBack) finalProductG += CAST_EARRING_BACK_WEIGHT_G;

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
    includePendantChain = false,
    includeBraceletChain = false,
    includeCastEarringBack = false,
  } = params;

  if (thicknessMm <= 0 || materialDensity <= 0) return null;

  const { kerf, finish } = getMaterialFactors(materialId);
  if (kerf <= 0 || finish <= 0) return null;

  const bail = includePendantBail ? PENDANT_BAIL_WEIGHT_G : 0;
  const chain = includePendantChain ? PENDANT_CHAIN_WEIGHT_G : 0;
  const bracelet = includeBraceletChain ? BRACELET_CHAIN_WEIGHT_G : 0;
  const castBack = includeCastEarringBack ? CAST_EARRING_BACK_WEIGHT_G : 0;
  const afterFinishG = targetFinalG - bail - chain - bracelet - castBack;

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
