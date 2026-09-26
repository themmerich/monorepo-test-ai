import { Route } from '@angular/router';
import { Vertragsdetail } from './vertragsdetail/vertragsdetail';
import { Vertragsuebersicht } from './vertragsuebersicht/vertragsuebersicht';

/**
 * Routen des Fachmoduls, relativ zum Pfad, unter dem die App es einhängt
 * (heute `/bestandsdaten`).
 *
 * Öffentlich (URL-Vertrag, siehe bestandsdatenVerweise in shared):
 *   ''               Vertragsübersicht, optional `?sparte=<Sparte>`
 *   ':vertragsnummer' Vertragsdetail
 */
export const bestandsdatenRoutes: Route[] = [
  { path: '', component: Vertragsuebersicht },
  { path: ':vertragsnummer', component: Vertragsdetail },
];
