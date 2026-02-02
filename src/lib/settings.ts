export interface LossSettings {
  moldFinishingLoss: number; // 0-100 (%)
  productionLoss: number; // 0-100 (%)
}

export const defaultLossSettings: LossSettings = {
  moldFinishingLoss: 0,
  productionLoss: 0,
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

export interface RingGroupPriceSettings {
  smallGroupDiscount: number; // Küçük grup indirim yüzdesi (0-100)
  largeGroupSurcharge: number; // Büyük grup ek ücret yüzdesi (0-100)
}

export const defaultRingGroupPriceSettings: RingGroupPriceSettings = {
  smallGroupDiscount: 10,
  largeGroupSurcharge: 15,
};

const RING_GROUP_PRICE_SETTINGS_KEY = "ring-group-price-settings";

export function getRingGroupPriceSettings(): RingGroupPriceSettings {
  if (typeof window === "undefined") {
    return defaultRingGroupPriceSettings;
  }

  try {
    const stored = localStorage.getItem(RING_GROUP_PRICE_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading ring group price settings from localStorage:", error);
  }

  return defaultRingGroupPriceSettings;
}

export function saveRingGroupPriceSettings(settings: RingGroupPriceSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(RING_GROUP_PRICE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving ring group price settings to localStorage:", error);
  }
}

export function resetRingGroupPriceSettings(): RingGroupPriceSettings {
  if (typeof window !== "undefined") {
    localStorage.removeItem(RING_GROUP_PRICE_SETTINGS_KEY);
  }
  return defaultRingGroupPriceSettings;
}

