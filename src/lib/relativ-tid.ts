/* Klient-side relativ tid for [data-tidspunkt]-elementer. Byggetids-
   fallbacken (datotekst) står til scriptet kjører — statiske sider blir
   aldri feil, bare mindre presise. */

export function relativTid(iso: string): string | null {
  const da = new Date(iso).getTime();
  if (Number.isNaN(da)) return null;
  const min = Math.max(1, Math.round((Date.now() - da) / 60000));
  if (min < 60) return `for ${min} min siden`;
  if (min < 60 * 24) return `for ${Math.round(min / 60)} t siden`;
  return `for ${Math.round(min / 1440)} d siden`;
}

export function settRelativeTider(rot: ParentNode = document): void {
  rot.querySelectorAll<HTMLElement>('[data-tidspunkt]').forEach((el) => {
    const tekst = relativTid(el.dataset.tidspunkt ?? '');
    if (tekst) el.textContent = el.dataset.parens === 'nei' ? tekst : `(${tekst})`;
  });
}
