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

  const calculateResult = (size: number): RingWeightResult => {
    // Lineer orantı: (Boy / 16) × Referans Gram
    const weight = (size / REFERENCE_SIZE) * referenceWeight;
    
    // Lineer orantı: (Boy / 16) × Referans Fiyat
    let price = referencePrice > 0 ? (size / REFERENCE_SIZE) * referencePrice : 0;
    
    // Grup bazlı fiyat ayarlamaları
    if (price > 0) {
      if (size >= 10 && size <= 13) {
        // Küçük grup: %10 indirim (varsayılan)
        price = price * (1 - smallGroupDiscount / 100);
      } else if (size >= 18 && size <= 20) {
        // Büyük grup: %15 ek ücret (varsayılan)
        price = price * (1 + largeGroupSurcharge / 100);
      }
      // Orta grup (14-17): değişiklik yok
    }
    
    return {
      size,
      weight: Math.round(weight * 100) / 100, // 2 ondalık basamak
      price: Math.round(price * 100) / 100, // 2 ondalık basamak
    };
  };

  return [
    {
      groupName: "Küçük Grup",
      sizes: [10, 11, 12, 13],
      results: [10, 11, 12, 13].map(calculateResult),
    },
    {
      groupName: "Orta Grup",
      sizes: [14, 15, 16, 17],
      results: [14, 15, 16, 17].map(calculateResult),
    },
    {
      groupName: "Büyük Grup",
      sizes: [18, 19, 20],
      results: [18, 19, 20].map(calculateResult),
    },
  ];
}

