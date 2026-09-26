import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideNavigation } from '@monorepo-test-ai/shared';
import { Shell } from './shell';

@Component({ template: 'Seite' })
class Seite {}

describe('Shell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            component: Shell,
            children: [
              { path: '', component: Seite },
              { path: 'a', component: Seite },
              {
                path: 'b',
                children: [
                  { path: 'eins', component: Seite },
                  { path: 'zwei', component: Seite },
                ],
              },
            ],
          },
        ]),
        provideNavigation([
          { label: 'Modul A', path: '/a' },
          {
            label: 'Modul B',
            path: '/b',
            kinder: [
              { label: 'B eins', path: '/b/eins' },
              { label: 'B zwei', path: '/b/zwei' },
            ],
          },
        ]),
      ],
    });
  });

  const links = (harness: RouterTestingHarness) =>
    Array.from(
      harness.fixture.nativeElement.querySelectorAll(
        'nav a',
      ) as NodeListOf<HTMLAnchorElement>,
    );
  const texte = (harness: RouterTestingHarness) =>
    links(harness).map((a) => a.textContent?.trim());

  it('rendert die Navigationseinträge, Untermenüs zugeklappt', async () => {
    const harness = await RouterTestingHarness.create('/a');

    expect(texte(harness)).toEqual(['Startseite', 'Modul A', 'Modul B']);
  });

  it('klappt das Untermenü im aktiven Bereich auf', async () => {
    const harness = await RouterTestingHarness.create('/b/zwei');

    expect(texte(harness)).toEqual([
      'Startseite',
      'Modul A',
      'Modul B',
      'B eins',
      'B zwei',
    ]);
    const aktiveUnterseite = harness.fixture.nativeElement.querySelector(
      '.untermenue a.aktiv',
    );
    expect(aktiveUnterseite?.textContent?.trim()).toBe('B zwei');
    expect(aktiveUnterseite?.getAttribute('aria-current')).toBe('page');
  });

  it('navigiert über das Untermenü und klappt es beim Verlassen wieder zu', async () => {
    const harness = await RouterTestingHarness.create('/b/eins');
    const router = TestBed.inject(Router);

    links(harness)
      .find((a) => a.textContent?.trim() === 'B zwei')
      ?.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/b/zwei');

    links(harness)
      .find((a) => a.textContent?.trim() === 'Modul A')
      ?.click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/a');
    expect(texte(harness)).not.toContain('B eins');
  });
});
