import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNavigation } from '@monorepo-test-ai/shared';
import { Shell } from './shell';

describe('Shell', () => {
  it('rendert die bereitgestellten Navigationseinträge', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNavigation([
          { label: 'Modul A', path: '/a' },
          { label: 'Modul B', path: '/b' },
        ]),
      ],
    });
    const fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const links = Array.from(element.querySelectorAll('nav a')).map((a) =>
      a.textContent?.trim(),
    );
    expect(links).toEqual(['Startseite', 'Modul A', 'Modul B']);
  });
});
