import { Route } from '@angular/router';
import { ungespeicherteAenderungenGuard } from '@monorepo-test-ai/shared';
import { ProvisionsbezeichnungenPflege } from './provisionsbezeichnungen/provisionsbezeichnungen';
import { Provisionserfassung } from './provisionserfassung/provisionserfassung';

/**
 * Zwei Unterseiten im selben Bereich. Die Navigation dorthin läuft über das
 * Untermenü der Shell (Einträge im App-Register `fachmodule.ts`).
 *
 *   /provisionsdatenerfassung               -> Weiterleitung auf erfassen
 *   /provisionsdatenerfassung/erfassen      -> Provisionen erfassen
 *   /provisionsdatenerfassung/bezeichnungen -> Provisionsbezeichnungen pflegen
 */
export const provisionsdatenerfassungRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'erfassen' },
  {
    path: 'erfassen',
    component: Provisionserfassung,
    title: 'Provisionen erfassen – Anwendungsrahmen',
  },
  {
    path: 'bezeichnungen',
    component: ProvisionsbezeichnungenPflege,
    title: 'Provisionsbezeichnungen – Anwendungsrahmen',
    canDeactivate: [ungespeicherteAenderungenGuard],
  },
];
