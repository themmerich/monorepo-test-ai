import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Seitenkopf mit Titel, optionalem Untertitel und Platz für Aktionen. */
@Component({
  selector: 'wuf-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h1>{{ titel() }}</h1>
      @if (untertitel()) {
        <p>{{ untertitel() }}</p>
      }
    </div>
    <div class="aktionen"><ng-content /></div>
  `,
  styles: `
    :host {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--wub-abstand-m);
      margin-bottom: var(--wub-abstand-l);
    }
    h1 {
      margin: 0;
      font-size: 1.6rem;
    }
    p {
      margin: 0.25rem 0 0;
      color: var(--wub-farbe-text-leise);
    }
    .aktionen {
      display: flex;
      gap: var(--wub-abstand-s);
    }
  `,
})
export class WufPageHeader {
  readonly titel = input.required<string>();
  readonly untertitel = input<string>();
}
