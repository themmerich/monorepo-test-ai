import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NAVIGATION_ITEMS } from '@monorepo-test-ai/shared';

/**
 * Rahmen der Anwendung: Kopfzeile, Navigation und Inhaltsbereich.
 *
 * Die Navigationseinträge kommen über das Token NAVIGATION_ITEMS.
 * Die Shell hat keine Abhängigkeit auf die Fachmodule.
 */
@Component({
  selector: 'ar-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  protected readonly navigation = inject(NAVIGATION_ITEMS);
}
