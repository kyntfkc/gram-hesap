export interface Material {
  id: string;
  name: string;
  density: number; // g/cm³
}

export const defaultMaterials: Material[] = [
  {
    id: "925-silver",
    name: "925 Gümüş",
    density: 10.4,
  },
  {
    id: "14k-gold",
    name: "14 Ayar Altın",
    density: 13.07,
  },
  {
    id: "18k-gold",
    name: "18 Ayar Altın",
    density: 15.58,
  },
  {
    id: "22k-gold",
    name: "22 Ayar Altın",
    density: 17.5,
  },
];

export const defaultMaterial = defaultMaterials.find((m) => m.id === "14k-gold")!;

const STORAGE_KEY = "material-densities";

export function getMaterials(): Material[] {
  if (typeof window === "undefined") {
    return defaultMaterials;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Stored değerleri default ile birleştir
      return defaultMaterials.map((material) => {
        const storedMaterial = parsed.find((m: Material) => m.id === material.id);
        return storedMaterial ? { ...material, density: storedMaterial.density } : material;
      });
    }
  } catch (error) {
    console.error("Error loading materials from localStorage:", error);
  }

  return defaultMaterials;
}

export function saveMaterials(materials: Material[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  } catch (error) {
    console.error("Error saving materials to localStorage:", error);
  }
}

export function resetMaterials(): Material[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return defaultMaterials;
}
