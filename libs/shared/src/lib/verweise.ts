import { Sparte } from './sparte';

/**
 * URL-Vertrag der Fachmodule.
 *
 * Fachmodule dürfen sich nicht gegenseitig importieren. Querverweise zwischen
 * Fachmodulen laufen deshalb über URLs, die hier zentral beschrieben sind:
 *
 * - Die App registriert jedes Fachmodul unter dem Pfad aus {@link FACHMODUL_PFADE}.
 * - Ein Fachmodul, das auf ein anderes verweist, nutzt die Verweis-Funktionen,
 *   z. B. `bestandsdatenVerweise.vertrag('LV-100231')`.
 * - Das Zielmodul muss die hier beschriebenen Routen und Query-Parameter
 *   unterstützen.
 *
 * Weil nur URLs ausgetauscht werden, bleibt der Vertrag gültig, wenn ein
 * Fachmodul später getrennt deployt wird.
 */
export const FACHMODUL_PFADE = {
  bestandsdaten: 'bestandsdaten',
  provisionsdatenerfassung: 'provisionsdatenerfassung',
  auswertung: 'auswertung',
} as const;

/** Ziel für `[routerLink]="verweis.pfad" [queryParams]="verweis.queryParams"` */
export interface Verweis {
  pfad: readonly string[];
  queryParams?: Record<string, string>;
}

/** Öffentliche Einstiegspunkte des Fachmoduls Bestandsdaten */
export const bestandsdatenVerweise = {
  /** Vertragsübersicht, optional nach Sparte gefiltert (Query-Parameter `sparte`) */
  vertraege: (filter: { sparte?: Sparte } = {}): Verweis => ({
    pfad: ['/', FACHMODUL_PFADE.bestandsdaten],
    queryParams: filter.sparte ? { sparte: filter.sparte } : undefined,
  }),

  /** Detailseite eines Vertrags */
  vertrag: (vertragsnummer: string): Verweis => ({
    pfad: ['/', FACHMODUL_PFADE.bestandsdaten, vertragsnummer],
  }),
};
