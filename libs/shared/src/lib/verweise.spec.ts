import { bestandsdatenVerweise } from './verweise';

describe('bestandsdatenVerweise', () => {
  it('verweist auf die Vertragsübersicht ohne Filter', () => {
    expect(bestandsdatenVerweise.vertraege()).toEqual({
      pfad: ['/', 'bestandsdaten'],
      queryParams: undefined,
    });
  });

  it('verweist auf die nach Sparte gefilterte Vertragsübersicht', () => {
    expect(
      bestandsdatenVerweise.vertraege({ sparte: 'KFZ' }).queryParams,
    ).toEqual({ sparte: 'KFZ' });
  });

  it('verweist auf einen einzelnen Vertrag', () => {
    expect(bestandsdatenVerweise.vertrag('LV-100231').pfad).toEqual([
      '/',
      'bestandsdaten',
      'LV-100231',
    ]);
  });
});
