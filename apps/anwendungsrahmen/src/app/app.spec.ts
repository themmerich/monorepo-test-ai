import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideNavigation } from '@monorepo-test-ai/shared';
import { appRoutes } from './app.routes';
import { fachmodulNavigation } from './fachmodule';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(appRoutes),
        provideNavigation(fachmodulNavigation),
      ],
    });
  });

  it('zeigt die Shell mit allen Fachmodulen in der Navigation', async () => {
    const harness = await RouterTestingHarness.create('/');
    const links = Array.from(
      harness.routeNativeElement?.ownerDocument.querySelectorAll('nav a') ?? [],
    ).map((a) => a.textContent?.trim());

    expect(links).toEqual([
      'Startseite',
      'Bestandsdaten',
      'Provisionsdatenerfassung',
      'Auswertung',
    ]);
  });

  it('lädt ein Fachmodul lazy', async () => {
    const harness = await RouterTestingHarness.create('/bestandsdaten');
    expect(harness.routeNativeElement?.textContent).toContain('Bestandsdaten');
  });
});
