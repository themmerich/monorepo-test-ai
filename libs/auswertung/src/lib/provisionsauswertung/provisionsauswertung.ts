import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { formatEuro, Sparte, SPARTEN } from '@monorepo-test-ai/shared';
import { WubCard } from '@monorepo-test-ai/wub';
import { WufPageHeader } from '@monorepo-test-ai/wuf';

interface ProvisionsSumme {
  sparte: Sparte;
  summe: number;
  anteilProzent: number;
}

@Component({
  selector: 'aw-provisionsauswertung',
  imports: [WufPageHeader, WubCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <wuf-page-header
      titel="Auswertung"
      untertitel="Provisionen im laufenden Jahr nach Sparte"
    />

    <wub-card [titel]="'Gesamt: ' + format(gesamt())">
      <ul class="balken">
        @for (zeile of summen(); track zeile.sparte) {
          <li>
            <span class="label">{{ zeile.sparte }}</span>
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
  `,
  styles: `
    .balken {
      display: grid;
      gap: 0.75rem;
      margin: var(--wub-abstand-m) 0 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: grid;
      grid-template-columns: 6rem 1fr 8rem;
      align-items: center;
      gap: var(--wub-abstand-m);
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
  `,
})
export class Provisionsauswertung {
  // Demodaten, später aus einem Backend-Service
  private readonly provisionen = signal<{ sparte: Sparte; betrag: number }[]>([
    { sparte: 'Leben', betrag: 12480 },
    { sparte: 'Leben', betrag: 3310 },
    { sparte: 'Kranken', betrag: 9120 },
    { sparte: 'Sach', betrag: 4275.5 },
    { sparte: 'KFZ', betrag: 2890 },
    { sparte: 'KFZ', betrag: 1450 },
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

  protected readonly format = formatEuro;
}
