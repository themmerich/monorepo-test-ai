import { Route } from '@angular/router';
import { Shell, Startseite } from '@monorepo-test-ai/anwendungsrahmen';
import { fachmodule } from './fachmodule';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: Startseite,
        title: 'Anwendungsrahmen',
      },
      ...fachmodule.map((modul): Route => ({
        path: modul.pfad,
        title: `${modul.label} – Anwendungsrahmen`,
        loadChildren: modul.laden,
      })),
    ],
  },
  { path: '**', redirectTo: '' },
];
