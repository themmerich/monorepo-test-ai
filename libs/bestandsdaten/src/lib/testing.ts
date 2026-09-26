import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { bestandsdatenRoutes } from './bestandsdaten.routes';

/** Hängt die Routen wie in der App unter /bestandsdaten ein und navigiert zur URL. */
export async function starteBestandsdaten(url: string) {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(
        [{ path: 'bestandsdaten', children: bestandsdatenRoutes }],
        withComponentInputBinding(),
      ),
    ],
  });
  const harness = await RouterTestingHarness.create(url);
  const element = () => harness.routeNativeElement as HTMLElement;
  const klicke = async (el: Element | null | undefined) => {
    if (!el) throw new Error('Element nicht gefunden');
    (el as HTMLElement).click();
    await harness.fixture.whenStable();
  };
  return { harness, element, klicke };
}
