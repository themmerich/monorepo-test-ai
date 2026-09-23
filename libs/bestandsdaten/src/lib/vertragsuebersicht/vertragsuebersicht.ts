import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { formatEuro, Sparte } from '@monorepo-test-ai/shared';
import { WufDataTable, WufPageHeader, WufSpalte } from '@monorepo-test-ai/wuf';

interface Vertrag {
  vertragsnummer: string;
  kunde: string;
  sparte: Sparte;
  jahresbeitrag: number;
}

@Component({
  selector: 'bd-vertragsuebersicht',
  imports: [WufPageHeader, WufDataTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <wuf-page-header
      titel="Bestandsdaten"
      [untertitel]="anzahl() + ' Verträge im Bestand'"
    />
    <wuf-data-table [spalten]="spalten" [zeilen]="vertraege()" />
  `,
})
export class Vertragsuebersicht {
  protected readonly vertraege = signal<Vertrag[]>([
    {
      vertragsnummer: 'LV-100231',
      kunde: 'Anna Berger',
      sparte: 'Leben',
      jahresbeitrag: 1840,
    },
    {
      vertragsnummer: 'KV-200417',
      kunde: 'Jonas Keller',
      sparte: 'Kranken',
      jahresbeitrag: 5220,
    },
    {
      vertragsnummer: 'SV-300982',
      kunde: 'Meier GmbH',
      sparte: 'Sach',
      jahresbeitrag: 960.5,
    },
    {
      vertragsnummer: 'KF-401155',
      kunde: 'Lea Schmitt',
      sparte: 'KFZ',
      jahresbeitrag: 712.4,
    },
    {
      vertragsnummer: 'LV-100877',
      kunde: 'Tom Wagner',
      sparte: 'Leben',
      jahresbeitrag: 2400,
    },
  ]);

  protected readonly anzahl = computed(() => this.vertraege().length);

  protected readonly spalten: WufSpalte<Vertrag>[] = [
    { key: 'vertragsnummer', label: 'Vertragsnummer' },
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
