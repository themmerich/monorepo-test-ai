import { InjectionToken, Provider } from '@angular/core';

/**
 * Ein Eintrag in der Navigation der Shell.
 *
 * Die Shell kennt die Fachmodule nicht direkt. Die App (bzw. später der Host)
 * stellt die Einträge über {@link provideNavigation} bereit.
 */
export interface NavigationItem {
  /** Anzeigetext im Menü */
  label: string;
  /** Absoluter Routen-Pfad, z. B. `/bestandsdaten` */
  path: string;
  /** Kurzbeschreibung, z. B. für die Startseite */
  beschreibung?: string;
}

export const NAVIGATION_ITEMS = new InjectionToken<readonly NavigationItem[]>(
  'NAVIGATION_ITEMS',
  { factory: () => [] },
);

export function provideNavigation(items: readonly NavigationItem[]): Provider {
  return { provide: NAVIGATION_ITEMS, useValue: items };
}
