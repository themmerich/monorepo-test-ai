import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MitUngespeichertenAenderungen } from '@monorepo-test-ai/shared';
import { WubButton, WubCard } from '@monorepo-test-ai/wub';
import { WufPageHeader } from '@monorepo-test-ai/wuf';
import {
  Provisionsbezeichnung,
  Provisionsbezeichnungen,
} from '../provisionsdaten';

type Zeile = FormGroup<{
  kuerzel: FormControl<string>;
  bezeichnung: FormControl<string>;
}>;

@Component({
  selector: 'pde-provisionsbezeichnungen',
  imports: [ReactiveFormsModule, WufPageHeader, WubCard, WubButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './provisionsbezeichnungen.html',
  styleUrl: './provisionsbezeichnungen.scss',
})
export class ProvisionsbezeichnungenPflege implements MitUngespeichertenAenderungen {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly bezeichnungen = inject(Provisionsbezeichnungen);

  protected readonly eintraege = this.fb.array<Zeile>([]);
  protected readonly formular = this.fb.group({ eintraege: this.eintraege });
  protected readonly gespeichert = signal(false);

  constructor() {
    this.ladeAusService();
  }

  hatUngespeicherteAenderungen(): boolean {
    return this.formular.dirty;
  }

  protected hinzufuegen(): void {
    this.eintraege.push(this.zeile({ kuerzel: '', bezeichnung: '' }));
    this.formular.markAsDirty();
    this.gespeichert.set(false);
  }

  protected entfernen(index: number): void {
    this.eintraege.removeAt(index);
    this.formular.markAsDirty();
    this.gespeichert.set(false);
  }

  protected speichern(): void {
    if (this.formular.invalid) {
      this.formular.markAllAsTouched();
      return;
    }
    this.bezeichnungen.speichern(this.eintraege.getRawValue());
    this.formular.markAsPristine();
    this.formular.markAsUntouched();
    this.gespeichert.set(true);
  }

  protected verwerfen(): void {
    this.ladeAusService();
    this.gespeichert.set(false);
  }

  private ladeAusService(): void {
    this.eintraege.clear();
    for (const b of this.bezeichnungen.alle()) {
      this.eintraege.push(this.zeile(b));
    }
    this.formular.markAsPristine();
    this.formular.markAsUntouched();
  }

  private zeile(b: Provisionsbezeichnung): Zeile {
    return this.fb.group({
      kuerzel: this.fb.control(b.kuerzel, [
        Validators.required,
        Validators.pattern(/^[A-Z]{2,3}$/),
      ]),
      bezeichnung: this.fb.control(b.bezeichnung, Validators.required),
    });
  }

  protected get zeilen(): Zeile[] {
    return this.eintraege.controls;
  }
}
