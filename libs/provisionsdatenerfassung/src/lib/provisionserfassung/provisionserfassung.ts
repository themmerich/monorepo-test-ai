import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  formatDatum,
  formatEuro,
  Sparte,
  SPARTEN,
} from '@monorepo-test-ai/shared';
import { WubButton, WubCard } from '@monorepo-test-ai/wub';
import { WufDataTable, WufPageHeader, WufSpalte } from '@monorepo-test-ai/wuf';

interface Provision {
  vertragsnummer: string;
  sparte: Sparte;
  betrag: number;
  buchungsdatum: string;
}

@Component({
  selector: 'pde-provisionserfassung',
  imports: [
    ReactiveFormsModule,
    WufPageHeader,
    WufDataTable,
    WubCard,
    WubButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './provisionserfassung.html',
  styleUrl: './provisionserfassung.scss',
})
export class Provisionserfassung {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly sparten = SPARTEN;

  protected readonly formular = this.fb.group({
    vertragsnummer: [
      '',
      [Validators.required, Validators.pattern(/^[A-Z]{2}-\d{6}$/)],
    ],
    sparte: this.fb.control<Sparte>('Leben'),
    betrag: [0, [Validators.required, Validators.min(0.01)]],
    buchungsdatum: [new Date().toISOString().slice(0, 10), Validators.required],
  });

  protected readonly erfasst = signal<Provision[]>([]);

  protected readonly spalten: WufSpalte<Provision>[] = [
    { key: 'vertragsnummer', label: 'Vertragsnummer' },
    { key: 'sparte', label: 'Sparte' },
    {
      key: 'buchungsdatum',
      label: 'Buchungsdatum',
      format: (wert) => formatDatum(wert as string),
    },
    {
      key: 'betrag',
      label: 'Betrag',
      ausrichtung: 'rechts',
      format: (wert) => formatEuro(wert as number),
    },
  ];

  protected speichern(): void {
    if (this.formular.invalid) {
      this.formular.markAllAsTouched();
      return;
    }
    const provision = this.formular.getRawValue();
    this.erfasst.update((liste) => [provision, ...liste]);
    this.formular.reset();
  }
}
