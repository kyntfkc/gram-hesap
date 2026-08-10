const VOLUME_KEY = "calc-last-volume-mm3";
const AREA_KEY = "calc-last-area-mm2";

export function formatInt(n: number): string {
  return Math.round(n).toLocaleString("tr-TR");
}

export function formatGram(n: number): string {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function saveVolumeMm3(volume: number): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(VOLUME_KEY, String(Math.round(volume)));
}

export function saveAreaMm2(area: number): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AREA_KEY, String(Math.round(area)));
}

export function getVolumeCopyText(): string {
  const volume =
    typeof window !== "undefined" ? sessionStorage.getItem(VOLUME_KEY) : null;
  return `Volume ${volume ?? "-"}`;
}

export function getAreaCopyText(): string {
  const area =
    typeof window !== "undefined" ? sessionStorage.getItem(AREA_KEY) : null;
  return `Area ${area ?? "-"}`;
}

export async function copyVolumeToClipboard(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(getVolumeCopyText());
    return true;
  } catch {
    return false;
  }
}

export async function copyAreaToClipboard(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(getAreaCopyText());
    return true;
  } catch {
    return false;
  }
}
