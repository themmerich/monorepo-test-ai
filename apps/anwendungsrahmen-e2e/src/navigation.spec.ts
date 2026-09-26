import { test, expect } from '@playwright/test';

test.describe('Navigation innerhalb von Bestandsdaten', () => {
  test('Übersicht -> Detail -> nächster Vertrag -> zurück', async ({
    page,
  }) => {
    await page.goto('/bestandsdaten');

    await page.getByRole('link', { name: 'LV-100231' }).click();
    await expect(page).toHaveURL('/bestandsdaten/LV-100231');
    await expect(page.locator('h1')).toHaveText('Vertrag LV-100231');

    await page.getByRole('button', { name: /Nächster Vertrag/ }).click();
    await expect(page).toHaveURL('/bestandsdaten/KV-200417');

    await page.goBack();
    await expect(page).toHaveURL('/bestandsdaten/LV-100231');

    await page.getByRole('link', { name: 'Zur Übersicht' }).click();
    await expect(page).toHaveURL('/bestandsdaten');
  });
});

test.describe('Navigation von Auswertung nach Bestandsdaten', () => {
  test('Sparte -> gefilterte Vertragsübersicht', async ({ page }) => {
    await page.goto('/auswertung');

    await page.getByRole('link', { name: 'KFZ', exact: true }).click();
    await expect(page).toHaveURL('/bestandsdaten?sparte=KFZ');
    await expect(page.locator('tbody tr')).toHaveCount(2);
  });

  test('Einzelprovision -> Vertragsdetail', async ({ page }) => {
    await page.goto('/auswertung');

    await page.getByRole('link', { name: 'KV-200417' }).click();
    await expect(page).toHaveURL('/bestandsdaten/KV-200417');
    await expect(page.locator('h1')).toHaveText('Vertrag KV-200417');
  });
});

test.describe('Unterseiten der Provisionsdatenerfassung', () => {
  test('Untermenü in der Side-Navigation wechselt die Unterseite', async ({
    page,
  }) => {
    await page.goto('/');
    const navigation = page.getByRole('navigation', {
      name: 'Hauptnavigation',
    });
    const untermenue = navigation.getByRole('group', {
      name: 'Provisionsdatenerfassung',
    });
    await expect(untermenue).toHaveCount(0);

    await navigation
      .getByRole('link', { name: 'Provisionsdatenerfassung' })
      .click();
    await expect(page).toHaveURL('/provisionsdatenerfassung/erfassen');
    await expect(untermenue.getByRole('link')).toHaveText([
      'Provisionen erfassen',
      'Provisionsbezeichnungen',
    ]);

    await untermenue
      .getByRole('link', { name: 'Provisionsbezeichnungen' })
      .click();
    await expect(page).toHaveURL('/provisionsdatenerfassung/bezeichnungen');
    await expect(page.locator('h1')).toHaveText('Provisionsbezeichnungen');
    await expect(
      untermenue.getByRole('link', { name: 'Provisionsbezeichnungen' }),
    ).toHaveAttribute('aria-current', 'page');

    await page.goBack();
    await expect(page).toHaveURL('/provisionsdatenerfassung/erfassen');
  });

  test('fragt bei ungespeicherten Änderungen nach', async ({ page }) => {
    await page.goto('/provisionsdatenerfassung/bezeichnungen');
    await page.getByLabel('Bezeichnung Zeile 1').fill('Geändert');

    page.once('dialog', (dialog) => dialog.dismiss());
    await page.getByRole('link', { name: 'Provisionen erfassen' }).click();
    await expect(page).toHaveURL('/provisionsdatenerfassung/bezeichnungen');
  });
});
