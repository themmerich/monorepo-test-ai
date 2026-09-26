import { CanDeactivateFn } from '@angular/router';

/** Komponenten mit Formularen, die beim Verlassen nicht verloren gehen sollen */
export interface MitUngespeichertenAenderungen {
  hatUngespeicherteAenderungen(): boolean;
}

/**
 * Fragt nach, bevor eine Seite mit ungespeicherten Änderungen verlassen wird.
 * Verwendung in der Route: `canDeactivate: [ungespeicherteAenderungenGuard]`
 */
export const ungespeicherteAenderungenGuard: CanDeactivateFn<
  MitUngespeichertenAenderungen
> = (komponente) =>
  !komponente.hatUngespeicherteAenderungen() ||
  window.confirm(
    'Es gibt ungespeicherte Änderungen. Möchten Sie die Seite trotzdem verlassen?',
  );
