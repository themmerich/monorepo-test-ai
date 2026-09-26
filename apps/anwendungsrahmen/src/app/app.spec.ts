import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  Router,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideNavigation } from '@monorepo-test-ai/shared';
import { appRoutes } from './app.routes';
import { fachmodulNavigation } from './fachmodule';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(appRoutes, withComponentInputBinding()),
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

  it('zeigt die Unterseiten der Provisionsdatenerfassung als Untermenü', async () => {
    const harness = await RouterTestingHarness.create(
      '/provisionsdatenerfassung',
    );
    const untermenue = Array.from(
      harness.fixture.nativeElement.querySelectorAll(
        '.untermenue a',
      ) as NodeListOf<HTMLAnchorElement>,
    );

    expect(untermenue.map((a) => a.textContent?.trim())).toEqual([
      'Provisionen erfassen',
      'Provisionsbezeichnungen',
    ]);
    expect(untermenue.map((a) => a.getAttribute('href'))).toEqual([
      '/provisionsdatenerfassung/erfassen',
      '/provisionsdatenerfassung/bezeichnungen',
    ]);
  });

  it('führt jeder Menüpunkt auf eine existierende Route', async () => {
    const harness = await RouterTestingHarness.create('/');
    const router = TestBed.inject(Router);
    const pfade = fachmodulNavigation.flatMap((e) => [
      e.path,
      ...(e.kinder ?? []).map((k) => k.path),
    ]);

    for (const pfad of pfade) {
      await harness.navigateByUrl(pfad);
      // Unbekannte Pfade landen über '**' auf der Startseite
      expect(router.url.startsWith(pfad), pfad).toBe(true);
    }
  });

  it('lädt ein Fachmodul lazy', async () => {
    const harness = await RouterTestingHarness.create('/bestandsdaten');
    expect(harness.routeNativeElement?.textContent).toContain('Bestandsdaten');
  });

  it('navigiert von der Auswertung in die gefilterten Bestandsdaten', async () => {
    const harness = await RouterTestingHarness.create('/auswertung');
    const kfz = Array.from(
      harness.routeNativeElement?.querySelectorAll('a') ?? [],
    ).find((a) => a.textContent?.trim() === 'KFZ');

    kfz?.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/bestandsdaten?sparte=KFZ');
    const element = harness.routeNativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toBe('Bestandsdaten');
    expect(element.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('navigiert von der Auswertung direkt zu einem Vertrag', async () => {
    const harness = await RouterTestingHarness.create('/auswertung');
    const vertrag = harness.routeNativeElement?.querySelector('ol a');

    (vertrag as HTMLElement | null)?.click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/bestandsdaten/LV-100231');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe(
      'Vertrag LV-100231',
    );
  });
});
