import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideNavigation } from '@monorepo-test-ai/shared';
import { appRoutes } from './app.routes';
import { fachmodulNavigation } from './fachmodule';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideNavigation(fachmodulNavigation),
  ],
};
