import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provisionsdatenerfassungRoutes } from './provisionsdatenerfassung.routes';

/** Hängt die Routen wie in der App unter /provisionsdatenerfassung ein. */
export async function starteProvisionsdatenerfassung(url: string) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {
          path: 'provisionsdatenerfassung',
          children: provisionsdatenerfassungRoutes,
        },
      ]),
    ],
  });
  const harness = await RouterTestingHarness.create(url);
  const router = TestBed.inject(Router);
  const element = () => harness.routeNativeElement as HTMLElement;
  const stabil = () => harness.fixture.whenStable();

  const klicke = async (el: Element | null | undefined) => {
    if (!el) throw new Error('Element nicht gefunden');
    (el as HTMLElement).click();
    await stabil();
  };
  const elementMitText = (selektor: string, text: string) =>
    Array.from(element().querySelectorAll(selektor)).find((e) =>
      e.textContent?.includes(text),
    );
  const tippe = async (selektor: string, wert: string) => {
    const feld = element().querySelector<HTMLInputElement | HTMLSelectElement>(
      selektor,
    );
    if (!feld) throw new Error(`Feld ${selektor} fehlt`);
    feld.value = wert;
    feld.dispatchEvent(
      new Event(feld instanceof HTMLSelectElement ? 'change' : 'input'),
    );
    await stabil();
  };

  return { harness, router, element, klicke, elementMitText, tippe, stabil };
}
