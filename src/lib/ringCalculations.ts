export const RING_SIZES = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const;
export const REFERENCE_SIZE = 16;

export interface RingWeightResult {
  size: number;
  weight: number;
  price: number;
}

export function calculateRingWeights(
  referenceWeight: number,
  referencePrice: number = 0
): RingWeightResult[] {
  if (referenceWeight <= 0) {
    return RING_SIZES.map((size) => ({
      size,
      weight: 0,
      price: 0,
    }));
  }

  return RING_SIZES.map((size) => {
    // Lineer orantı: (Boy / 16) × Referans Gram
    const weight = (size / REFERENCE_SIZE) * referenceWeight;
    // Lineer orantı: (Boy / 16) × Referans Fiyat
    const price = referencePrice > 0 ? (size / REFERENCE_SIZE) * referencePrice : 0;
    return {
      size,
      weight: Math.round(weight * 100) / 100, // 2 ondalık basamak
      price: Math.round(price * 100) / 100, // 2 ondalık basamak
    };
  });
}

