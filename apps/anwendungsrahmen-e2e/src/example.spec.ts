import { test, expect } from '@playwright/test';

test('Startseite verlinkt alle Fachmodule', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toHaveText('Willkommen');
  const navigation = page.getByRole('navigation', { name: 'Hauptnavigation' });
  await expect(navigation.getByRole('link')).toHaveText([
    'Startseite',
    'Bestandsdaten',
    'Provisionsdatenerfassung',
    'Auswertung',
  ]);
});

for (const [link, titel] of [
  ['Bestandsdaten', 'Bestandsdaten'],
  ['Provisionsdatenerfassung', 'Provisionen erfassen'],
  ['Auswertung', 'Auswertung'],
]) {
  test(`Navigation zu ${link}`, async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Hauptnavigation' })
      .getByRole('link', { name: link })
      .click();

    await expect(page.locator('h1')).toHaveText(titel);
  });
}
