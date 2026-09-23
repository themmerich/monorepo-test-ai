import { TestBed } from '@angular/core/testing';
import { WubCard } from './card';

describe('WubCard', () => {
  it('zeigt den Titel an', async () => {
    const fixture = TestBed.createComponent(WubCard);
    fixture.componentRef.setInput('titel', 'Hallo');
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h3')?.textContent).toBe('Hallo');
  });
});
