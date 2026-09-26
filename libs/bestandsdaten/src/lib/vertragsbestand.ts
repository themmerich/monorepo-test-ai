import { Injectable, signal } from '@angular/core';
import { Sparte } from '@monorepo-test-ai/shared';

export interface Vertrag {
  vertragsnummer: string;
  kunde: string;
  sparte: Sparte;
  jahresbeitrag: number;
  beginn: string;
}

/** Datenquelle des Fachmoduls. Demodaten, später aus einem Backend-Service. */
@Injectable({ providedIn: 'root' })
export class Vertragsbestand {
  readonly alle = signal<readonly Vertrag[]>([
    {
      vertragsnummer: 'LV-100231',
      kunde: 'Anna Berger',
      sparte: 'Leben',
      jahresbeitrag: 1840,
      beginn: '2019-04-01',
    },
    {
      vertragsnummer: 'KV-200417',
      kunde: 'Jonas Keller',
      sparte: 'Kranken',
      jahresbeitrag: 5220,
      beginn: '2021-01-01',
    },
    {
      vertragsnummer: 'SV-300982',
      kunde: 'Meier GmbH',
      sparte: 'Sach',
      jahresbeitrag: 960.5,
      beginn: '2022-07-15',
    },
    {
      vertragsnummer: 'KF-401155',
      kunde: 'Lea Schmitt',
      sparte: 'KFZ',
      jahresbeitrag: 712.4,
      beginn: '2024-03-01',
    },
    {
      vertragsnummer: 'LV-100877',
      kunde: 'Tom Wagner',
      sparte: 'Leben',
      jahresbeitrag: 2400,
      beginn: '2018-10-01',
    },
    {
      vertragsnummer: 'KF-401290',
      kunde: 'Meier GmbH',
      sparte: 'KFZ',
      jahresbeitrag: 1310,
      beginn: '2025-01-01',
    },
  ]).asReadonly();

  finde(vertragsnummer: string): Vertrag | undefined {
    return this.alle().find((v) => v.vertragsnummer === vertragsnummer);
  }
}
