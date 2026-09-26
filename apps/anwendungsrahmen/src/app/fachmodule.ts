import { LoadChildrenCallback } from '@angular/router';
import { FACHMODUL_PFADE, NavigationItem } from '@monorepo-test-ai/shared';

export interface Fachmodul {
  /** Routen-Segment, unter dem das Fachmodul erreichbar ist (Teil des URL-Vertrags) */
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
  /**
   * Unterseiten als Untermenü in der Side-Navigation. `pfad` ist relativ zum
   * Fachmodul und muss zu den Routen der Lib passen (geprüft in app.spec.ts).
   */
  unterseiten?: { pfad: string; label: string }[];
}

/** Zentrales Register aller Fachmodule der Anwendung. */
export const fachmodule: Fachmodul[] = [
  {
    pfad: FACHMODUL_PFADE.bestandsdaten,
    label: 'Bestandsdaten',
    beschreibung: 'Verträge und Kunden im Bestand einsehen.',
    laden: () =>
      import('@monorepo-test-ai/bestandsdaten').then(
        (m) => m.bestandsdatenRoutes,
      ),
  },
  {
    pfad: FACHMODUL_PFADE.provisionsdatenerfassung,
    label: 'Provisionsdatenerfassung',
    beschreibung: 'Provisionen zu Verträgen erfassen.',
    laden: () =>
      import('@monorepo-test-ai/provisionsdatenerfassung').then(
        (m) => m.provisionsdatenerfassungRoutes,
      ),
    unterseiten: [
      { pfad: 'erfassen', label: 'Provisionen erfassen' },
      { pfad: 'bezeichnungen', label: 'Provisionsbezeichnungen' },
    ],
  },
  {
    pfad: FACHMODUL_PFADE.auswertung,
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
  kinder: m.unterseiten?.map((u) => ({
    label: u.label,
    path: `/${m.pfad}/${u.pfad}`,
  })),
}));
