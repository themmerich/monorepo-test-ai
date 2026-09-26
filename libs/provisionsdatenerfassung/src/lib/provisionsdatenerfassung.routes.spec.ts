import { starteProvisionsdatenerfassung } from './testing';

describe('Navigation im Bereich Provisionsdatenerfassung', () => {
  afterEach(() => vi.restoreAllMocks());

  it('leitet den Bereich auf die Unterseite "erfassen" weiter', async () => {
    const { router, element } = await starteProvisionsdatenerfassung(
      '/provisionsdatenerfassung',
    );

    expect(router.url).toBe('/provisionsdatenerfassung/erfassen');
    expect(element().querySelector('h1')?.textContent).toBe(
      'Provisionen erfassen',
    );
  });

  it('verlinkt von der Erfassung relativ auf die Bezeichnungen', async () => {
    const { router, element, klicke, elementMitText } =
      await starteProvisionsdatenerfassung(
        '/provisionsdatenerfassung/erfassen',
      );

    await klicke(elementMitText('a', 'Bezeichnungen bearbeiten'));

    expect(router.url).toBe('/provisionsdatenerfassung/bezeichnungen');
    expect(element().querySelector('h1')?.textContent).toBe(
      'Provisionsbezeichnungen',
    );
  });

  it('behält erfasste Provisionen beim Wechsel der Unterseite', async () => {
    const { harness, element, tippe, stabil } =
      await starteProvisionsdatenerfassung(
        '/provisionsdatenerfassung/erfassen',
      );

    await tippe('[formControlName="vertragsnummer"]', 'KV-200417');
    await tippe('[formControlName="betrag"]', '80');
    element().querySelector('form')?.dispatchEvent(new Event('submit'));
    await stabil();

    await harness.navigateByUrl('/provisionsdatenerfassung/bezeichnungen');
    await harness.navigateByUrl('/provisionsdatenerfassung/erfassen');

    expect(element().querySelector('tbody')?.textContent).toContain(
      'KV-200417',
    );
  });

  it('übernimmt gespeicherte Bezeichnungen in die Erfassung', async () => {
    const { harness, element, klicke, elementMitText, tippe } =
      await starteProvisionsdatenerfassung(
        '/provisionsdatenerfassung/bezeichnungen',
      );

    await tippe('[aria-label="Bezeichnung Zeile 1"]', 'Abschlussprovision neu');
    await klicke(elementMitText('button', 'Speichern'));
    await harness.navigateByUrl('/provisionsdatenerfassung/erfassen');

    const erste = element().querySelector('[formControlName="art"] option');
    expect(erste?.textContent?.trim()).toBe('Abschlussprovision neu');
  });

  it('fragt vor dem Verlassen mit ungespeicherten Änderungen nach', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { router, tippe } = await starteProvisionsdatenerfassung(
      '/provisionsdatenerfassung/bezeichnungen',
    );

    await tippe('[aria-label="Kürzel Zeile 1"]', 'AB');
    expect(
      await router.navigateByUrl('/provisionsdatenerfassung/erfassen'),
    ).toBe(false);
    expect(confirm).toHaveBeenCalledOnce();
    expect(router.url).toBe('/provisionsdatenerfassung/bezeichnungen');

    confirm.mockReturnValue(true);
    expect(
      await router.navigateByUrl('/provisionsdatenerfassung/erfassen'),
    ).toBe(true);
    expect(router.url).toBe('/provisionsdatenerfassung/erfassen');
  });

  it('fragt ohne Änderungen nicht nach', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    const { router } = await starteProvisionsdatenerfassung(
      '/provisionsdatenerfassung/bezeichnungen',
    );

    await router.navigateByUrl('/provisionsdatenerfassung/erfassen');

    expect(confirm).not.toHaveBeenCalled();
    expect(router.url).toBe('/provisionsdatenerfassung/erfassen');
  });
});
