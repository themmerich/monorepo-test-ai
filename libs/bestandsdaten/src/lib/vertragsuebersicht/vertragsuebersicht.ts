import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { formatEuro, Sparte, SPARTEN } from '@monorepo-test-ai/shared';
import { WufDataTable, WufPageHeader, WufSpalte } from '@monorepo-test-ai/wuf';
import { Vertrag, Vertragsbestand } from '../vertragsbestand';

@Component({
  selector: 'bd-vertragsuebersicht',
  imports: [WufPageHeader, WufDataTable, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <wuf-page-header
      titel="Bestandsdaten"
      [untertitel]="vertraege().length + ' Verträge im Bestand'"
    />

    <!-- Interne Navigation über Query-Parameter: gleiche Route, anderer Filter -->
    <nav class="filter" aria-label="Filter nach Sparte">
      <a
        routerLink="."
        routerLinkActive="aktiv"
        [routerLinkActiveOptions]="{
          paths: 'exact',
          queryParams: 'exact',
          matrixParams: 'ignored',
          fragment: 'ignored',
        }"
        >Alle</a
      >
      @for (s of sparten; track s) {
        <a
          routerLink="."
          [queryParams]="{ sparte: s }"
          routerLinkActive="aktiv"
          >{{ s }}</a
        >
      }
    </nav>

    <wuf-data-table
      [spalten]="spalten"
      [zeilen]="vertraege()"
      leerText="Keine Verträge in dieser Sparte"
    />
  `,
  styles: `
    .filter {
      display: flex;
      flex-wrap: wrap;
      gap: var(--wub-abstand-s);
      margin-bottom: var(--wub-abstand-m);
    }
    .filter a {
      padding: 0.3rem 0.8rem;
      color: var(--wub-farbe-text);
      text-decoration: none;
      background: var(--wub-farbe-flaeche);
      border: 1px solid var(--wub-farbe-rahmen);
      border-radius: 999px;
    }
    .filter a.aktiv {
      color: #fff;
      background: var(--wub-farbe-primaer);
      border-color: var(--wub-farbe-primaer);
    }
  `,
})
export class Vertragsuebersicht {
  private readonly bestand = inject(Vertragsbestand);

  /**
   * Query-Parameter `?sparte=...`, per withComponentInputBinding gebunden.
   * Teil des URL-Vertrags (siehe bestandsdatenVerweise in shared).
   */
  readonly sparte = input<Sparte>();

  protected readonly sparten = SPARTEN;

  protected readonly vertraege = computed(() => {
    const sparte = this.sparte();
    const alle = this.bestand.alle();
    return sparte ? alle.filter((v) => v.sparte === sparte) : alle;
  });

  protected readonly spalten: WufSpalte<Vertrag>[] = [
    {
      key: 'vertragsnummer',
      label: 'Vertragsnummer',
      // Relativer Link: /bestandsdaten -> /bestandsdaten/<vertragsnummer>
      link: (vertrag) => [vertrag.vertragsnummer],
    },
    { key: 'kunde', label: 'Kunde' },
    { key: 'sparte', label: 'Sparte' },
    {
      key: 'jahresbeitrag',
      label: 'Jahresbeitrag',
      ausrichtung: 'rechts',
      format: (wert) => formatEuro(wert as number),
    },
  ];
}
