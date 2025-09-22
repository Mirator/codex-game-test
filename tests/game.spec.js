const { test, expect } = require('@playwright/test');

const RUNE_SYMBOLS = new Set(['Δ', '◈', '✶', '⟡']);

test.describe('Codex Convergence', () => {
  test('shows the ritual controls on load', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Codex Convergence');

    const modal = page.locator('#titleModal');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'Codex Convergence' })).toBeVisible();

    const startButton = page.getByRole('button', { name: 'Start Ritual' });
    await expect(startButton).toBeEnabled();

    const pauseButton = page.getByRole('button', { name: 'Pause' });
    await expect(pauseButton).toBeDisabled();

    const overlay = page.locator('#gridOverlay');
    await expect(overlay).toContainText('Tap Start Ritual to begin');
  });

  test('starts the ritual and populates the grid with runes', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Commence Binding' }).click();

    const overlay = page.locator('#gridOverlay');
    await expect(overlay).toHaveClass(/hidden/);

    const pauseButton = page.getByRole('button', { name: 'Pause' });
    await expect(pauseButton).toBeEnabled();

    const cells = page.locator('.grid .cell');
    await expect(cells).toHaveCount(36);

    const symbols = await cells.allTextContents();
    expect(symbols.length).toBeGreaterThan(0);
    for (const symbol of symbols) {
      expect(RUNE_SYMBOLS.has(symbol.trim())).toBeTruthy();
    }

    const timerBefore = parseFloat((await page.locator('#timeRemaining').textContent()) ?? '0');
    await page.waitForTimeout(1200);
    const timerAfter = parseFloat((await page.locator('#timeRemaining').textContent()) ?? '0');
    expect(timerAfter).toBeLessThan(timerBefore);
  });
});
