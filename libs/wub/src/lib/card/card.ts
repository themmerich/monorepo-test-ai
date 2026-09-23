import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'wub-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (titel()) {
      <h3 class="wub-card__titel">{{ titel() }}</h3>
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: block;
      padding: var(--wub-abstand-l);
      background: var(--wub-farbe-flaeche);
      border: 1px solid var(--wub-farbe-rahmen);
      border-radius: var(--wub-radius);
    }
    .wub-card__titel {
      margin: 0 0 var(--wub-abstand-s);
      font-size: 1.05rem;
    }
  `,
})
export class WubCard {
  readonly titel = input<string>();
}
