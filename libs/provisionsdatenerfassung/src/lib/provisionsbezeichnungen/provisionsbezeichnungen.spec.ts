import { TestBed } from '@angular/core/testing';
import { Provisionsbezeichnungen } from '../provisionsdaten';
import { starteProvisionsdatenerfassung } from '../testing';

describe('ProvisionsbezeichnungenPflege', () => {
  const url = '/provisionsdatenerfassung/bezeichnungen';

  it('zeigt die vorhandenen Bezeichnungen als bearbeitbare Zeilen', async () => {
    const { element } = await starteProvisionsdatenerfassung(url);

    expect(element().querySelectorAll('tbody tr').length).toBe(3);
    expect(
      element().querySelector<HTMLInputElement>(
        '[aria-label="Bezeichnung Zeile 2"]',
      )?.value,
    ).toBe('Bestandsprovision');
  });

  it('speichert eine neue Zeile', async () => {
    const { klicke, elementMitText, tippe } =
      await starteProvisionsdatenerfassung(url);

    await klicke(elementMitText('button', 'Zeile hinzufügen'));
    await tippe('[aria-label="Kürzel Zeile 4"]', 'SP');
    await tippe('[aria-label="Bezeichnung Zeile 4"]', 'Sonderprovision');
    await klicke(elementMitText('button', 'Speichern'));

    expect(TestBed.inject(Provisionsbezeichnungen).alle()).toContainEqual({
      kuerzel: 'SP',
      bezeichnung: 'Sonderprovision',
    });
    expect(elementMitText('[role="status"]', 'Gespeichert')).toBeTruthy();
  });

  it('speichert nicht bei ungültigem Kürzel', async () => {
    const { element, klicke, elementMitText, tippe } =
      await starteProvisionsdatenerfassung(url);

    await tippe('[aria-label="Kürzel Zeile 1"]', 'abc1');
    await klicke(elementMitText('button', 'Speichern'));

    expect(TestBed.inject(Provisionsbezeichnungen).bezeichnung('AP')).toBe(
      'Abschlussprovision',
    );
    expect(element().querySelector('.fehler')).toBeTruthy();
  });

  it('verwirft Änderungen und entfernte Zeilen', async () => {
    const { element, klicke, elementMitText } =
      await starteProvisionsdatenerfassung(url);

    await klicke(elementMitText('button', 'Entfernen'));
    expect(element().querySelectorAll('tbody tr').length).toBe(2);

    await klicke(elementMitText('button', 'Verwerfen'));
    expect(element().querySelectorAll('tbody tr').length).toBe(3);
    expect(TestBed.inject(Provisionsbezeichnungen).alle().length).toBe(3);
  });
});
