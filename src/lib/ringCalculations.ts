import { RingGroupPriceSettings } from "./settings";

export const RING_SIZES = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const;
export const REFERENCE_SIZE = 16;

export interface RingWeightResult {
  size: number;
  weight: number;
  price: number;
}

export interface RingGroupResult {
  groupName: string;
  sizes: number[];
  results: RingWeightResult[];
}

export function calculateRingWeights(
  referenceWeight: number,
  referencePrice: number = 0,
  priceSettings?: RingGroupPriceSettings
): RingGroupResult[] {
  if (referenceWeight <= 0) {
    return [
      {
        groupName: "Küçük Grup",
        sizes: [10, 11, 12, 13],
        results: [10, 11, 12, 13].map((size) => ({
          size,
          weight: 0,
          price: 0,
        })),
      },
      {
        groupName: "Orta Grup",
        sizes: [14, 15, 16, 17],
        results: [14, 15, 16, 17].map((size) => ({
          size,
          weight: 0,
          price: 0,
        })),
      },
      {
        groupName: "Büyük Grup",
        sizes: [18, 19, 20],
        results: [18, 19, 20].map((size) => ({
          size,
          weight: 0,
          price: 0,
        })),
      },
    ];
  }

  const smallGroupDiscount = priceSettings?.smallGroupDiscount ?? 10;
  const largeGroupSurcharge = priceSettings?.largeGroupSurcharge ?? 15;

  // Baz fiyat = Referans fiyat (16 numara için girilen fiyat)
  const basePrice = referencePrice > 0 ? referencePrice : 0;

  // Grup bazlı fiyatlar hesapla
  const smallGroupPrice = basePrice > 0 ? basePrice * (1 - smallGroupDiscount / 100) : 0;
  const mediumGroupPrice = basePrice > 0 ? basePrice * 1.00 : 0; // Değişiklik yok
  const largeGroupPrice = basePrice > 0 ? basePrice * (1 + largeGroupSurcharge / 100) : 0;

  const calculateResult = (size: number, groupPrice: number): RingWeightResult => {
    // Lineer orantı: (Boy / 16) × Referans Gram
    const weight = (size / REFERENCE_SIZE) * referenceWeight;
    
    return {
      size,
      weight: Math.round(weight * 100) / 100, // 2 ondalık basamak
      price: Math.round(groupPrice * 100) / 100, // 2 ondalık basamak - grup bazlı aynı fiyat
    };
  };

  return [
    {
      groupName: "Küçük Grup",
      sizes: [10, 11, 12, 13],
      results: [10, 11, 12, 13].map((size) => calculateResult(size, smallGroupPrice)),
    },
    {
      groupName: "Orta Grup",
      sizes: [14, 15, 16, 17],
      results: [14, 15, 16, 17].map((size) => calculateResult(size, mediumGroupPrice)),
    },
    {
      groupName: "Büyük Grup",
      sizes: [18, 19, 20],
      results: [18, 19, 20].map((size) => calculateResult(size, largeGroupPrice)),
    },
  ];
}

