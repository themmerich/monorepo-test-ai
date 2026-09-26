import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  bestandsdatenVerweise,
  formatEuro,
  Sparte,
  SPARTEN,
} from '@monorepo-test-ai/shared';
import { WubCard } from '@monorepo-test-ai/wub';
import { WufPageHeader } from '@monorepo-test-ai/wuf';

interface Provision {
  vertragsnummer: string;
  sparte: Sparte;
  betrag: number;
}

interface ProvisionsSumme {
  sparte: Sparte;
  summe: number;
  anteilProzent: number;
}

/**
 * Querverweise nach Bestandsdaten laufen nur über den URL-Vertrag
 * (`bestandsdatenVerweise` aus shared). Es gibt keinen Import aus dem
 * Fachmodul Bestandsdaten.
 */
@Component({
  selector: 'aw-provisionsauswertung',
  imports: [RouterLink, WufPageHeader, WubCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <wuf-page-header
      titel="Auswertung"
      untertitel="Provisionen im laufenden Jahr nach Sparte"
    />

    <wub-card [titel]="'Gesamt: ' + format(gesamt())">
      <ul class="balken">
        @for (zeile of summen(); track zeile.sparte) {
          @let ziel = verweise.vertraege({ sparte: zeile.sparte });
          <li>
            <a
              class="label"
              [routerLink]="ziel.pfad"
              [queryParams]="ziel.queryParams"
              >{{ zeile.sparte }}</a
            >
            <span class="spur">
              <span
                class="fuellung"
                [style.width.%]="zeile.anteilProzent"
              ></span>
            </span>
            <span class="wert">{{ format(zeile.summe) }}</span>
          </li>
        }
      </ul>
    </wub-card>

    <wub-card titel="Größte Einzelprovisionen" class="top">
      <ol>
        @for (p of groessteProvisionen(); track p.vertragsnummer) {
          <li>
            <a [routerLink]="verweise.vertrag(p.vertragsnummer).pfad">{{
              p.vertragsnummer
            }}</a>
            <span>{{ p.sparte }}</span>
            <span class="wert">{{ format(p.betrag) }}</span>
          </li>
        }
      </ol>
    </wub-card>
  `,
  styles: `
    .balken {
      display: grid;
      gap: 0.75rem;
      margin: var(--wub-abstand-m) 0 0;
      padding: 0;
      list-style: none;
    }
    .balken li {
      display: grid;
      grid-template-columns: 6rem 1fr 8rem;
      align-items: center;
      gap: var(--wub-abstand-m);
    }
    a {
      color: var(--wub-farbe-primaer);
      font-weight: 600;
    }
    .spur {
      height: 0.75rem;
      background: var(--wub-farbe-hintergrund);
      border-radius: 999px;
      overflow: hidden;
    }
    .fuellung {
      display: block;
      height: 100%;
      background: var(--wub-farbe-primaer);
      border-radius: inherit;
    }
    .wert {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .top {
      margin-top: var(--wub-abstand-m);
    }
    ol {
      display: grid;
      gap: var(--wub-abstand-s);
      margin: 0;
      padding-left: 1.2rem;
    }
    ol li span {
      margin-left: var(--wub-abstand-m);
    }
  `,
})
export class Provisionsauswertung {
  protected readonly verweise = bestandsdatenVerweise;

  // Demodaten, später aus einem Backend-Service
  private readonly provisionen = signal<Provision[]>([
    { vertragsnummer: 'LV-100231', sparte: 'Leben', betrag: 12480 },
    { vertragsnummer: 'LV-100877', sparte: 'Leben', betrag: 3310 },
    { vertragsnummer: 'KV-200417', sparte: 'Kranken', betrag: 9120 },
    { vertragsnummer: 'SV-300982', sparte: 'Sach', betrag: 4275.5 },
    { vertragsnummer: 'KF-401155', sparte: 'KFZ', betrag: 2890 },
    { vertragsnummer: 'KF-401290', sparte: 'KFZ', betrag: 1450 },
  ]);

  protected readonly gesamt = computed(() =>
    this.provisionen().reduce((summe, p) => summe + p.betrag, 0),
  );

  protected readonly summen = computed<ProvisionsSumme[]>(() => {
    const jeSparte = SPARTEN.map((sparte) => ({
      sparte,
      summe: this.provisionen()
        .filter((p) => p.sparte === sparte)
        .reduce((summe, p) => summe + p.betrag, 0),
    }));
    const maximum = Math.max(...jeSparte.map((z) => z.summe), 1);
    return jeSparte.map((z) => ({
      ...z,
      anteilProzent: (z.summe / maximum) * 100,
    }));
  });

  protected readonly groessteProvisionen = computed(() =>
    [...this.provisionen()].sort((a, b) => b.betrag - a.betrag).slice(0, 3),
  );

  protected readonly format = formatEuro;
}
