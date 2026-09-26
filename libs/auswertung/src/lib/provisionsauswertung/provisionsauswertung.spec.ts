import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Provisionsauswertung } from './provisionsauswertung';

describe('Provisionsauswertung', () => {
  async function erzeuge() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Provisionsauswertung);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('zeigt je Sparte einen Balken', async () => {
    const element = await erzeuge();

    const sparten = Array.from(element.querySelectorAll('.label')).map(
      (e) => e.textContent,
    );
    expect(sparten).toEqual(['Leben', 'Kranken', 'Sach', 'KFZ']);
  });

  it('verlinkt jede Sparte auf die gefilterte Vertragsübersicht in Bestandsdaten', async () => {
    const element = await erzeuge();

    const hrefs = Array.from(element.querySelectorAll('.label')).map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual([
      '/bestandsdaten?sparte=Leben',
      '/bestandsdaten?sparte=Kranken',
      '/bestandsdaten?sparte=Sach',
      '/bestandsdaten?sparte=KFZ',
    ]);
  });

  it('verlinkt die größten Einzelprovisionen auf den Vertrag in Bestandsdaten', async () => {
    const element = await erzeuge();

    const hrefs = Array.from(element.querySelectorAll('ol a')).map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual([
      '/bestandsdaten/LV-100231',
      '/bestandsdaten/KV-200417',
      '/bestandsdaten/SV-300982',
    ]);
  });
});
