import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { starteBestandsdaten } from '../testing';

const knopf = (element: HTMLElement, text: string) =>
  Array.from(element.querySelectorAll('button')).find((b) =>
    b.textContent?.includes(text),
  );

describe('Vertragsdetail', () => {
  it('zeigt den Vertrag aus dem Routen-Parameter', async () => {
    const { element } = await starteBestandsdaten('/bestandsdaten/KV-200417');

    expect(element().querySelector('h1')?.textContent).toBe(
      'Vertrag KV-200417',
    );
    expect(element().textContent).toContain('Jonas Keller');
  });

  it('führt mit "Zur Übersicht" zurück zur Liste', async () => {
    const { element, klicke } = await starteBestandsdaten(
      '/bestandsdaten/KV-200417',
    );

    const zurueck = Array.from(element().querySelectorAll('a')).find((a) =>
      a.textContent?.includes('Zur Übersicht'),
    );
    await klicke(zurueck);

    expect(TestBed.inject(Router).url).toBe('/bestandsdaten');
  });

  it('verlinkt die Sparte auf die gefilterte Übersicht', async () => {
    const { element } = await starteBestandsdaten('/bestandsdaten/KV-200417');

    const sparte = element().querySelector('dd a');
    expect(sparte?.getAttribute('href')).toBe('/bestandsdaten?sparte=Kranken');
  });

  it('blättert programmatisch zum nächsten und vorherigen Vertrag', async () => {
    const { element, klicke } = await starteBestandsdaten(
      '/bestandsdaten/LV-100231',
    );
    const router = TestBed.inject(Router);

    expect(knopf(element(), 'Vorheriger')?.disabled).toBe(true);

    await klicke(knopf(element(), 'Nächster'));
    expect(router.url).toBe('/bestandsdaten/KV-200417');
    expect(element().querySelector('h1')?.textContent).toBe(
      'Vertrag KV-200417',
    );

    await klicke(knopf(element(), 'Vorheriger'));
    expect(router.url).toBe('/bestandsdaten/LV-100231');
  });

  it('meldet eine unbekannte Vertragsnummer', async () => {
    const { element } = await starteBestandsdaten('/bestandsdaten/XX-000000');

    expect(element().querySelector('h1')?.textContent).toBe(
      'Vertrag nicht gefunden',
    );
  });
});
