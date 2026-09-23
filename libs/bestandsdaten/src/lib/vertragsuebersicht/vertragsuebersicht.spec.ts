import { TestBed } from '@angular/core/testing';
import { Vertragsuebersicht } from './vertragsuebersicht';

describe('Vertragsuebersicht', () => {
  it('listet die Verträge auf', async () => {
    const fixture = TestBed.createComponent(Vertragsuebersicht);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toBe('Bestandsdaten');
    expect(element.querySelectorAll('tbody tr').length).toBe(5);
  });
});
