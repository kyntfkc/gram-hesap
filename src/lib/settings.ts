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


