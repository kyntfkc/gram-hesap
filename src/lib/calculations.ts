export interface CalculationParams {
  volume: number; // mm³ (hesaplamada cm³'e çevrilecek)
  materialDensity: number; // g/cm³
  infill: number; // 0-100 (%)
  moldFinishingLoss: number; // 0-100 (%)
  productionLoss: number; // 0-100 (%)
  stoneWeight: number; // g
}

export interface CalculationResult {
  baseWeight: number; // g
  afterMoldFinishing: number; // g
  afterProductionLoss: number; // g
  finalWeight: number; // g
}

export function calculateWeight(params: CalculationParams): CalculationResult {
  const { volume, materialDensity, infill, moldFinishingLoss, productionLoss, stoneWeight } = params;

  // Hacim mm³'den cm³'e çevir (1 cm³ = 1000 mm³)
  const volumeCm3 = volume / 1000;

  // 1. Temel Ağırlık = Hacim (cm³) × Malzeme Yoğunluğu × (Infill / 100)
  const baseWeight = volumeCm3 * materialDensity * (infill / 100);

  // 2. Kalıp Tesviye Sonrası = Temel Ağırlık × (1 - Kalıp Tesviye Kayıpları / 100)
  const afterMoldFinishing = baseWeight * (1 - moldFinishingLoss / 100);

  // 3. Üretim Kayıpları Sonrası = Kalıp Tesviye Sonrası × (1 - Üretim Kayıpları / 100)
  const afterProductionLoss = afterMoldFinishing * (1 - productionLoss / 100);

  // 4. Final Ağırlık = Üretim Kayıpları Sonrası + Taş Ağırlığı
  const finalWeight = afterProductionLoss + stoneWeight;

  return {
    baseWeight: Math.round(baseWeight * 100) / 100,
    afterMoldFinishing: Math.round(afterMoldFinishing * 100) / 100,
    afterProductionLoss: Math.round(afterProductionLoss * 100) / 100,
    finalWeight: Math.round(finalWeight * 100) / 100,
  };
}

