import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { formatDatum, formatEuro } from '@monorepo-test-ai/shared';
import { WubButton, WubCard } from '@monorepo-test-ai/wub';
import { WufPageHeader } from '@monorepo-test-ai/wuf';
import { Vertrag, Vertragsbestand } from '../vertragsbestand';

@Component({
  selector: 'bd-vertragsdetail',
  imports: [RouterLink, WufPageHeader, WubCard, WubButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vertrag(); as v) {
      <wuf-page-header
        [titel]="'Vertrag ' + v.vertragsnummer"
        [untertitel]="v.kunde"
      >
        <!-- Deklarativ, relativ: eine Ebene hoch zur Übersicht -->
        <a wubButton variante="sekundaer" routerLink="..">Zur Übersicht</a>
      </wuf-page-header>

      <wub-card titel="Vertragsdaten">
        <dl>
          <dt>Kunde</dt>
          <dd>{{ v.kunde }}</dd>
          <dt>Sparte</dt>
          <dd>
            <!-- Relativ mit Query-Parameter: zurück zur gefilterten Übersicht -->
            <a routerLink=".." [queryParams]="{ sparte: v.sparte }">{{
              v.sparte
            }}</a>
          </dd>
          <dt>Jahresbeitrag</dt>
          <dd>{{ euro(v.jahresbeitrag) }}</dd>
          <dt>Vertragsbeginn</dt>
          <dd>{{ datum(v.beginn) }}</dd>
        </dl>
      </wub-card>

      <!-- Programmatisch: Router.navigate relativ zur aktuellen Route -->
      <div class="blaettern">
        @let vorher = vorheriger();
        @let nachher = naechster();
        <button
          wubButton
          variante="sekundaer"
          type="button"
          [disabled]="!vorher"
          (click)="oeffne(vorher)"
        >
          ← Vorheriger Vertrag
        </button>
        <button
          wubButton
          variante="sekundaer"
          type="button"
          [disabled]="!nachher"
          (click)="oeffne(nachher)"
        >
          Nächster Vertrag →
        </button>
      </div>
    } @else {
      <wuf-page-header
        titel="Vertrag nicht gefunden"
        [untertitel]="
          'Zur Nummer ' + vertragsnummer() + ' gibt es keinen Vertrag.'
        "
      >
        <a wubButton variante="sekundaer" routerLink="..">Zur Übersicht</a>
      </wuf-page-header>
    }
  `,
  styles: `
    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: var(--wub-abstand-s) var(--wub-abstand-l);
      margin: 0;
    }
    dt {
      color: var(--wub-farbe-text-leise);
    }
    dd {
      margin: 0;
    }
    a:not(.wub-button) {
      color: var(--wub-farbe-primaer);
    }
    .blaettern {
      display: flex;
      justify-content: space-between;
      margin-top: var(--wub-abstand-l);
    }
  `,
})
export class Vertragsdetail {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly bestand = inject(Vertragsbestand);

  /** Routen-Parameter `:vertragsnummer`, per withComponentInputBinding gebunden */
  readonly vertragsnummer = input.required<string>();

  protected readonly vertrag = computed(() =>
    this.bestand.finde(this.vertragsnummer()),
  );

  private readonly position = computed(() =>
    this.bestand
      .alle()
      .findIndex((v) => v.vertragsnummer === this.vertragsnummer()),
  );

  protected readonly vorheriger = computed(() =>
    this.position() > 0 ? this.bestand.alle()[this.position() - 1] : undefined,
  );

  protected readonly naechster = computed(() =>
    this.position() >= 0 ? this.bestand.alle()[this.position() + 1] : undefined,
  );

  protected readonly euro = formatEuro;
  protected readonly datum = formatDatum;

  protected oeffne(vertrag: Vertrag | undefined): void {
    if (!vertrag) return;
    // /bestandsdaten/LV-100231 -> /bestandsdaten/KV-200417
    this.router.navigate(['..', vertrag.vertragsnummer], {
      relativeTo: this.route,
    });
  }
}
