import { starteProvisionsdatenerfassung } from '../testing';

describe('Provisionserfassung', () => {
  it('übernimmt eine gültige Eingabe in die Liste', async () => {
    const { element, tippe, stabil } = await starteProvisionsdatenerfassung(
      '/provisionsdatenerfassung/erfassen',
    );

    await tippe('[formControlName="vertragsnummer"]', 'LV-100231');
    await tippe('[formControlName="art"]', 'BP');
    await tippe('[formControlName="betrag"]', '125.5');
    element().querySelector('form')?.dispatchEvent(new Event('submit'));
    await stabil();

    const zeilen = element().querySelectorAll('tbody tr');
    expect(zeilen.length).toBe(1);
    expect(zeilen[0].textContent).toContain('LV-100231');
    expect(zeilen[0].textContent).toContain('Bestandsprovision');
  });

  it('verwirft eine ungültige Vertragsnummer', async () => {
    const { element, stabil } = await starteProvisionsdatenerfassung(
      '/provisionsdatenerfassung/erfassen',
    );

    element().querySelector('form')?.dispatchEvent(new Event('submit'));
    await stabil();

    expect(element().querySelector('.leer')).toBeTruthy();
    expect(element().querySelector('.fehler')).toBeTruthy();
  });

  it('bietet die gepflegten Provisionsbezeichnungen zur Auswahl an', async () => {
    const { element } = await starteProvisionsdatenerfassung(
      '/provisionsdatenerfassung/erfassen',
    );

    const optionen = Array.from(
      element().querySelectorAll('[formControlName="art"] option'),
    ).map((o) => o.textContent?.trim());
    expect(optionen).toEqual([
      'Abschlussprovision',
      'Bestandsprovision',
      'Folgeprovision',
    ]);
  });
});
