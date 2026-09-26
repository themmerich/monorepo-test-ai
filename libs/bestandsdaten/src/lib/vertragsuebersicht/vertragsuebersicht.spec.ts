import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { starteBestandsdaten } from '../testing';

describe('Vertragsuebersicht', () => {
  it('listet alle Verträge auf', async () => {
    const { element } = await starteBestandsdaten('/bestandsdaten');

    expect(element().querySelector('h1')?.textContent).toBe('Bestandsdaten');
    expect(element().querySelectorAll('tbody tr').length).toBe(6);
  });

  it('filtert nach dem Query-Parameter sparte', async () => {
    const { element } = await starteBestandsdaten('/bestandsdaten?sparte=KFZ');

    const nummern = Array.from(
      element().querySelectorAll('tbody td:first-child'),
    ).map((td) => td.textContent?.trim());
    expect(nummern).toEqual(['KF-401155', 'KF-401290']);
  });

  it('setzt den Filter über die Filter-Links', async () => {
    const { element, klicke } = await starteBestandsdaten('/bestandsdaten');

    const leben = Array.from(element().querySelectorAll('.filter a')).find(
      (a) => a.textContent?.trim() === 'Leben',
    );
    await klicke(leben);

    expect(TestBed.inject(Router).url).toBe('/bestandsdaten?sparte=Leben');
    expect(element().querySelectorAll('tbody tr').length).toBe(2);
  });

  it('verlinkt jede Vertragsnummer auf die Detailseite', async () => {
    const { element, klicke } = await starteBestandsdaten('/bestandsdaten');

    const link = element().querySelector('tbody td:first-child a');
    expect(link?.getAttribute('href')).toBe('/bestandsdaten/LV-100231');

    await klicke(link);
    expect(TestBed.inject(Router).url).toBe('/bestandsdaten/LV-100231');
    expect(element().querySelector('h1')?.textContent).toBe(
      'Vertrag LV-100231',
    );
  });
});
