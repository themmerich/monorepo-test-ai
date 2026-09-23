import { TestBed } from '@angular/core/testing';
import { WufDataTable, WufSpalte } from './data-table';

interface Zeile {
  name: string;
  wert: number;
}

describe('WufDataTable', () => {
  it('rendert Kopf und Zeilen', async () => {
    const fixture = TestBed.createComponent(WufDataTable<Zeile>);
    const spalten: WufSpalte<Zeile>[] = [
      { key: 'name', label: 'Name' },
      { key: 'wert', label: 'Wert', format: (w) => `${w} €` },
    ];
    fixture.componentRef.setInput('spalten', spalten);
    fixture.componentRef.setInput('zeilen', [{ name: 'A', wert: 5 }]);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('th').length).toBe(2);
    expect(
      element.querySelector('tbody td:last-child')?.textContent?.trim(),
    ).toBe('5 €');
  });

  it('zeigt einen Hinweis bei leerer Liste', async () => {
    const fixture = TestBed.createComponent(WufDataTable<Zeile>);
    fixture.componentRef.setInput('spalten', [{ key: 'name', label: 'Name' }]);
    fixture.componentRef.setInput('zeilen', []);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.leer')?.textContent?.trim()).toBe(
      'Keine Einträge vorhanden',
    );
  });
});
