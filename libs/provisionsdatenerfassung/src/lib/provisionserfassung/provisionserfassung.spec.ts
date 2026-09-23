import { TestBed } from '@angular/core/testing';
import { Provisionserfassung } from './provisionserfassung';

describe('Provisionserfassung', () => {
  it('übernimmt eine gültige Eingabe in die Liste', async () => {
    const fixture = TestBed.createComponent(Provisionserfassung);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    const eingabe = (name: string, wert: string) => {
      const feld = element.querySelector<HTMLInputElement>(
        `[formControlName="${name}"]`,
      );
      if (!feld) throw new Error(`Feld ${name} fehlt`);
      feld.value = wert;
      feld.dispatchEvent(new Event('input'));
    };
    eingabe('vertragsnummer', 'LV-100231');
    eingabe('betrag', '125.5');
    element.querySelector('form')?.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    const zeilen = element.querySelectorAll('tbody tr');
    expect(zeilen.length).toBe(1);
    expect(zeilen[0].textContent).toContain('LV-100231');
  });

  it('verwirft eine ungültige Vertragsnummer', async () => {
    const fixture = TestBed.createComponent(Provisionserfassung);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector('form')?.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    expect(element.querySelector('.leer')).toBeTruthy();
    expect(element.querySelector('.fehler')).toBeTruthy();
  });
});
