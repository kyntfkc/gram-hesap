/** 14 Ayar altın yoğunluğu (g/cm³) - formülde sabit */
const DENSITY_14K = 13.07;

/** Kerf: high = %8 kayıp (×0.92), low = %2.5 kayıp (×0.975) - lazer kesim her zaman kayıp verir */
const KERF_HIGH = 0.92;
const KERF_LOW = 0.975;

/** Cila/tesviye: %15 kayıp (×0.85) - lazer sonrası ağırlığa göre */
const FINISH_HIGH = 0.85;
const FINISH_LOW = 0.85;

export type SheetMetalComplexity = "high" | "low";

/** Kolye tepeliği (bail) ek ağırlığı (g) */
export const PENDANT_BAIL_WEIGHT_G = 0.15;

/** Kolye zinciri ek ağırlığı (g) */
export const PENDANT_CHAIN_WEIGHT_G = 1.0;

export interface SheetMetalParams {
  areaMm2: number;
  thicknessMm: number;
  complexity: SheetMetalComplexity;
  includePendantBail?: boolean;
  includePendantChain?: boolean;
}

export interface SheetMetalResult {
  theoreticalG: number;
  afterLaserG: number;
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
  const { areaMm2, thicknessMm, complexity, includePendantBail = false, includePendantChain = false } = params;

  const theoreticalG = (areaMm2 * thicknessMm * DENSITY_14K) / 1000;
  const kerfFactor = complexity === "high" ? KERF_HIGH : KERF_LOW;
  const finishFactor = complexity === "high" ? FINISH_HIGH : FINISH_LOW;

  const afterLaserG = theoreticalG * kerfFactor;
  let finalProductG = afterLaserG * finishFactor;
  if (includePendantBail) finalProductG += PENDANT_BAIL_WEIGHT_G;
  if (includePendantChain) finalProductG += PENDANT_CHAIN_WEIGHT_G;

  return {
    theoreticalG: round2(theoreticalG),
    afterLaserG: round2(afterLaserG),
    finalProductG: round2(finalProductG),
  };
}
