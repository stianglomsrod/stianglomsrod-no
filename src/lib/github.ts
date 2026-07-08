/* GitHub-henting ved byggetid (Done 6–7). Kjøres kun server-side —
   GITHUB_TOKEN (uten PUBLIC_-prefiks) når aldri klienten. Feiler alltid
   trygt til statisk snapshot: siden kan ikke bli stale eller knekke bygget.
   «Cache» for statisk output er selve byggeartefakten; hver deploy
   re-henter. */

import fallback from '../data/github-fallback.json';

export interface Commit {
  repo: string;
  sha: string;
  melding: string;
  tidspunkt: string;
  kilde: 'live' | 'fallback';
}

export interface HeatmapDag {
  dato: string;
  antall: number;
  nivaa: 0 | 1 | 2 | 3 | 4;
}

export interface Heatmap {
  totalt: number;
  uker: { dager: HeatmapDag[] }[];
  kilde: 'live' | 'fallback';
}

const BRUKER = 'stianglomsrod';

function apiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'stianglomsrod-no-build',
  };
  const token = import.meta.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/* Events deles mellom ticker og feed innenfor samme bygg. */
let eventsPromise: Promise<any[]> | null = null;

function hentEvents(): Promise<any[]> {
  eventsPromise ??= fetch(`https://api.github.com/users/${BRUKER}/events?per_page=100`, {
    headers: apiHeaders(),
    signal: AbortSignal.timeout(5000),
  }).then((res) => {
    if (!res.ok) throw new Error(`events: ${res.status}`);
    return res.json();
  });
  return eventsPromise;
}

function kortMelding(melding: string): string {
  const linje = melding.split('\n')[0];
  return linje.length > 72 ? linje.slice(0, 69) + '…' : linje;
}

export async function hentSisteCommits(antall: number): Promise<Commit[]> {
  try {
    const events = await hentEvents();
    const pushes = events
      .filter((e) => e.type === 'PushEvent' && e.payload?.head)
      .slice(0, antall);
    if (pushes.length === 0) throw new Error('ingen PushEvents');

    // Events-payloaden har ikke lenger commit-meldinger — hent head-committene.
    const commits = await Promise.all(
      pushes.map(async (p): Promise<Commit> => {
        const res = await fetch(
          `https://api.github.com/repos/${p.repo.name}/commits/${p.payload.head}`,
          { headers: apiHeaders(), signal: AbortSignal.timeout(5000) }
        );
        if (!res.ok) throw new Error(`commit: ${res.status}`);
        const c = await res.json();
        return {
          repo: p.repo.name,
          sha: String(p.payload.head).slice(0, 7),
          melding: kortMelding(c.commit?.message ?? ''),
          tidspunkt: p.created_at,
          kilde: 'live',
        };
      })
    );
    return commits;
  } catch {
    return fallback.sisteCommits
      .slice(0, antall)
      .map((c) => ({ ...c, kilde: 'fallback' as const }));
  }
}

const NIVAA: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

/* Heatmap krever GraphQL contributionsCollection og dermed GITHUB_TOKEN
   (PRD). Uten token eller ved feil: fallback-snapshot; null → komponenten
   viser en stille plassholder i stedet for matrisen. */
export async function hentHeatmap(): Promise<Heatmap | null> {
  const token = import.meta.env.GITHUB_TOKEN;
  if (token) {
    try {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { ...apiHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query($login: String!) {
            user(login: $login) {
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                  weeks { contributionDays { date contributionCount contributionLevel } }
                }
              }
            }
          }`,
          variables: { login: BRUKER },
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`graphql: ${res.status}`);
      const data = await res.json();
      const kalender = data?.data?.user?.contributionsCollection?.contributionCalendar;
      if (!kalender) throw new Error('tom kalender');
      return {
        totalt: kalender.totalContributions,
        uker: kalender.weeks.map((u: any) => ({
          dager: u.contributionDays.map(
            (d: any): HeatmapDag => ({
              dato: d.date,
              antall: d.contributionCount,
              nivaa: NIVAA[d.contributionLevel] ?? 0,
            })
          ),
        })),
        kilde: 'live',
      };
    } catch {
      /* faller videre til snapshot */
    }
  }
  return fallback.heatmap
    ? { ...(fallback.heatmap as Omit<Heatmap, 'kilde'>), kilde: 'fallback' }
    : null;
}
