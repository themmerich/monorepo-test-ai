import { LoadChildrenCallback } from '@angular/router';
import { NavigationItem } from '@monorepo-test-ai/shared';

export interface Fachmodul {
  /** Routen-Segment, unter dem das Fachmodul erreichbar ist */
  pfad: string;
  label: string;
  beschreibung: string;
  /**
   * Lädt die Routen des Fachmoduls lazy.
   *
   * Heute ein dynamischer Import aus dem Monorepo (eigener Chunk, ein Deployment).
   * Bei getrenntem Deployment wird daraus z. B.
   * `() => loadRemote('bestandsdaten/Routes').then(m => m.bestandsdatenRoutes)`.
   */
  laden: LoadChildrenCallback;
}

/** Zentrales Register aller Fachmodule der Anwendung. */
export const fachmodule: Fachmodul[] = [
  {
    pfad: 'bestandsdaten',
    label: 'Bestandsdaten',
    beschreibung: 'Verträge und Kunden im Bestand einsehen.',
    laden: () =>
      import('@monorepo-test-ai/bestandsdaten').then(
        (m) => m.bestandsdatenRoutes,
      ),
  },
  {
    pfad: 'provisionsdatenerfassung',
    label: 'Provisionsdatenerfassung',
    beschreibung: 'Provisionen zu Verträgen erfassen.',
    laden: () =>
      import('@monorepo-test-ai/provisionsdatenerfassung').then(
        (m) => m.provisionsdatenerfassungRoutes,
      ),
  },
  {
    pfad: 'auswertung',
    label: 'Auswertung',
    beschreibung: 'Provisionen nach Sparte auswerten.',
    laden: () =>
      import('@monorepo-test-ai/auswertung').then((m) => m.auswertungRoutes),
  },
];

export const fachmodulNavigation: NavigationItem[] = fachmodule.map((m) => ({
  label: m.label,
  path: `/${m.pfad}`,
  beschreibung: m.beschreibung,
}));
