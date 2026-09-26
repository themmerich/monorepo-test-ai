import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NAVIGATION_ITEMS, NavigationItem } from '@monorepo-test-ai/shared';
import { filter, map } from 'rxjs';

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
  private readonly router = inject(Router);

  protected readonly navigation = inject(NAVIGATION_ITEMS);

  /** Aktueller Pfad ohne Query-Parameter und Fragment */
  private readonly pfad = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.aktuellerPfad()),
    ),
    { initialValue: this.aktuellerPfad() },
  );

  /** Pfade der Einträge, deren Untermenü aufgeklappt ist */
  protected readonly aufgeklappt = computed(() => {
    const pfad = this.pfad();
    return new Set(
      this.navigation
        .filter((e) => e.kinder?.length && liegtIn(pfad, e))
        .map((e) => e.path),
    );
  });

  private aktuellerPfad(): string {
    return this.router.url.split(/[?#]/)[0];
  }
}

function liegtIn(pfad: string, eintrag: NavigationItem): boolean {
  return pfad === eintrag.path || pfad.startsWith(`${eintrag.path}/`);
}
