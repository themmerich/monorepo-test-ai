import { Injectable, signal } from '@angular/core';
import { Sparte } from '@monorepo-test-ai/shared';

export interface Provisionsbezeichnung {
  kuerzel: string;
  bezeichnung: string;
}

export interface Provision {
  vertragsnummer: string;
  sparte: Sparte;
  /** Kürzel einer Provisionsbezeichnung */
  art: string;
  betrag: number;
  buchungsdatum: string;
}

/**
 * Stammdaten: Bezeichnungen der Provisionsarten.
 *
 * Liegt in einem Service und nicht in einer Seite, weil beide Unterseiten
 * darauf zugreifen und Komponenten beim Reiterwechsel zerstört werden.
 */
@Injectable({ providedIn: 'root' })
export class Provisionsbezeichnungen {
  private readonly liste = signal<readonly Provisionsbezeichnung[]>([
    { kuerzel: 'AP', bezeichnung: 'Abschlussprovision' },
    { kuerzel: 'BP', bezeichnung: 'Bestandsprovision' },
    { kuerzel: 'FP', bezeichnung: 'Folgeprovision' },
  ]);

  readonly alle = this.liste.asReadonly();

  speichern(bezeichnungen: readonly Provisionsbezeichnung[]): void {
    this.liste.set(bezeichnungen.map((b) => ({ ...b })));
  }

  bezeichnung(kuerzel: string): string {
    return (
      this.liste().find((b) => b.kuerzel === kuerzel)?.bezeichnung ?? kuerzel
    );
  }
}

/** Erfasste Provisionen. Überleben so einen Wechsel zwischen den Unterseiten. */
@Injectable({ providedIn: 'root' })
export class ErfassteProvisionen {
  private readonly liste = signal<readonly Provision[]>([]);

  readonly alle = this.liste.asReadonly();

  hinzufuegen(provision: Provision): void {
    this.liste.update((liste) => [provision, ...liste]);
  }
}
