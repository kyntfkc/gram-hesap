/** Yüzük koçanı açıkken final ağırlıktan düşülecek gram (sabit) */
export const RING_CONE_DEDUCTION_G = 0.06;

export interface CalculationParams {
  volume: number; // mm³ (hesaplamada cm³'e çevrilecek)
  materialDensity: number; // g/cm³
  infill: number; // 0-100 (%)
  moldFinishingLoss: number; // 0-100 (%)
  productionLoss: number; // 0-100 (%)
  stoneWeight: number; // g
  necklaceTipGrams: number; // Kolye tepeliği (g), 0 = hesaba dahil değil
  earringBackGrams: number; // Küpe çivi/kelebek (g), 0 = hesaba dahil değil
  ringConeDeductionG: number; // Yüzük koçanı (g), 0 = hesaba dahil değil, açıkken final'dan düşülür
}

export interface CalculationResult {
  baseWeight: number; // g
  afterMoldFinishing: number; // g
  afterProductionLoss: number; // g
  finalWeight: number; // g
}

export function calculateWeight(params: CalculationParams): CalculationResult {
  const { volume, materialDensity, infill, moldFinishingLoss, productionLoss, stoneWeight, necklaceTipGrams, earringBackGrams, ringConeDeductionG = 0 } = params;

  // Hacim mm³'den cm³'e çevir (1 cm³ = 1000 mm³)
  const volumeCm3 = volume / 1000;

  // 1. Temel Ağırlık = Hacim (cm³) × Malzeme Yoğunluğu × (Infill / 100)
  const baseWeight = volumeCm3 * materialDensity * (infill / 100);

  // 2. Kalıp Tesviye Sonrası = Temel Ağırlık × (1 - Kalıp Tesviye Kayıpları / 100)
  const afterMoldFinishing = baseWeight * (1 - moldFinishingLoss / 100);

  // 3. Üretim Kayıpları Sonrası = Kalıp Tesviye Sonrası × (1 - Üretim Kayıpları / 100)
  const afterProductionLoss = afterMoldFinishing * (1 - productionLoss / 100);

  // 4. Ekstra ağırlıklar (ayarlardan gelen gram değerleri)
  const extraWeight = (necklaceTipGrams || 0) + (earringBackGrams || 0);

  // 5. Final Ağırlık = Üretim Kayıpları Sonrası + Taş Ağırlığı + Ekstra Ağırlıklar - Yüzük Koçanı (açıksa)
  const finalWeight = afterProductionLoss + stoneWeight + extraWeight - (ringConeDeductionG || 0);

  return {
    baseWeight: Math.round(baseWeight * 100) / 100,
    afterMoldFinishing: Math.round(afterMoldFinishing * 100) / 100,
    afterProductionLoss: Math.round(afterProductionLoss * 100) / 100,
    finalWeight: Math.round(finalWeight * 100) / 100,
  };
}

