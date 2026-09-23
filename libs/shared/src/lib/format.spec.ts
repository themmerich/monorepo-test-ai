import { formatDatum, formatEuro } from './format';

describe('format', () => {
  it('formatiert Beträge in Euro', () => {
    expect(formatEuro(1234.5)).toBe('1.234,50 €');
  });

  it('formatiert ISO-Daten deutsch', () => {
    expect(formatDatum('2026-09-23')).toBe('23.9.2026');
  });
});
