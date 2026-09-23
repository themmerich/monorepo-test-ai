import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAVIGATION_ITEMS } from '@monorepo-test-ai/shared';
import { WubButton, WubCard } from '@monorepo-test-ai/wub';
import { WufPageHeader } from '@monorepo-test-ai/wuf';

@Component({
  selector: 'ar-startseite',
  imports: [RouterLink, WufPageHeader, WubCard, WubButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <wuf-page-header
      titel="Willkommen"
      untertitel="Wählen Sie einen fachlichen Bereich."
    />

    <div class="kacheln">
      @for (eintrag of navigation; track eintrag.path) {
        <wub-card [titel]="eintrag.label">
          <p>{{ eintrag.beschreibung }}</p>
          <a wubButton variante="sekundaer" [routerLink]="eintrag.path">
            Öffnen
          </a>
        </wub-card>
      }
    </div>
  `,
  styles: `
    .kacheln {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
      gap: var(--wub-abstand-m);
    }
    p {
      min-height: 3em;
      color: var(--wub-farbe-text-leise);
    }
  `,
})
export class Startseite {
  protected readonly navigation = inject(NAVIGATION_ITEMS);
}
