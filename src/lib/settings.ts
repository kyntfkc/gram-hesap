export interface LossSettings {
  moldFinishingLoss: number; // 0-100 (%)
  productionLoss: number; // 0-100 (%)
}

export const defaultLossSettings: LossSettings = {
  moldFinishingLoss: 15,
  productionLoss: 16,
};

const LOSS_SETTINGS_KEY = "loss-settings";

export function getLossSettings(): LossSettings {
  if (typeof window === "undefined") {
    return defaultLossSettings;
  }

  try {
    const stored = localStorage.getItem(LOSS_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading loss settings from localStorage:", error);
  }

  return defaultLossSettings;
}

export function saveLossSettings(settings: LossSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(LOSS_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving loss settings to localStorage:", error);
  }
}

export function resetLossSettings(): LossSettings {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOSS_SETTINGS_KEY);
  }
  return defaultLossSettings;
}

export interface ExtraWeightSettings {
  necklaceTipGrams: number; // Kolye tepeliği (g)
  earringBackGrams: number; // Küpe çivi/kelebek (g)
  castEarringBackGrams: number; // Döküm küpe arkalığı (g)
  braceletChainGrams: number; // Bileklik zinciri (g)
}

export const defaultExtraWeightSettings: ExtraWeightSettings = {
  necklaceTipGrams: 0.12,
  earringBackGrams: 0.4,
  castEarringBackGrams: 0.9,
  braceletChainGrams: 0.75,
};

const EXTRA_WEIGHT_SETTINGS_KEY = "extra-weight-settings";

export function getExtraWeightSettings(): ExtraWeightSettings {
  if (typeof window === "undefined") return defaultExtraWeightSettings;
  try {
    const stored = localStorage.getItem(EXTRA_WEIGHT_SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ExtraWeightSettings>;
      // Eski localStorage verileri yeni alanları içermeyebilir
      return {
        ...defaultExtraWeightSettings,
        ...parsed,
      };
    }
  } catch (error) {
    console.error("Error loading extra weight settings from localStorage:", error);
  }
  return defaultExtraWeightSettings;
}

export function saveExtraWeightSettings(settings: ExtraWeightSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXTRA_WEIGHT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving extra weight settings to localStorage:", error);
  }
}

export function resetExtraWeightSettings(): ExtraWeightSettings {
  if (typeof window !== "undefined") localStorage.removeItem(EXTRA_WEIGHT_SETTINGS_KEY);
  return defaultExtraWeightSettings;
}
