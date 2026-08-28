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
    id: "8k-gold",
    name: "8 Ayar Altın",
    density: 11.0,
  },
  {
    id: "10k-gold",
    name: "10 Ayar Altın",
    density: 11.57,
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

export function getMaterials(): Material[] {
  return defaultMaterials;
}
