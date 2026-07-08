/* Sandbox-hue (Done 12): klient-hjelper. Verdien clampes alltid 0–360 og
   settes kun på sidene som importerer denne (sandbox + 404). */

const NOKKEL = 'hue';

export function clampHue(verdi: unknown): number {
  const n = Math.round(Number(verdi));
  if (!Number.isFinite(n)) return 145;
  return Math.min(360, Math.max(0, n));
}

export function lesHue(): number | null {
  try {
    const raa = localStorage.getItem(NOKKEL);
    return raa === null ? null : clampHue(raa);
  } catch {
    return null;
  }
}

export function settHue(verdi: number, lagre: boolean): void {
  const h = clampHue(verdi);
  document.documentElement.style.setProperty('--hue', String(h));
  if (lagre) {
    try {
      localStorage.setItem(NOKKEL, String(h));
    } catch {}
  }
}

/** Brukes av 404: arv lagret hue uten å vise kontroll. */
export function arvHue(): void {
  const lagret = lesHue();
  if (lagret !== null) settHue(lagret, false);
}
