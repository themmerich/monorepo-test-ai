import { TestBed } from '@angular/core/testing';
import { Provisionsauswertung } from './provisionsauswertung';

describe('Provisionsauswertung', () => {
  it('zeigt je Sparte einen Balken', async () => {
    const fixture = TestBed.createComponent(Provisionsauswertung);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const sparten = Array.from(element.querySelectorAll('.label')).map(
      (e) => e.textContent,
    );
    expect(sparten).toEqual(['Leben', 'Kranken', 'Sach', 'KFZ']);
  });
});
