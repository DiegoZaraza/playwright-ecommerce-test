import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
  }

  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.waitFor({ state: 'attached' });
    await locator.click({ force: false });
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill('');
    await locator.fill(text);
  }

  async getTextContent(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  getViewportSize(): { width: number; height: number } | null {
    return this.page.viewportSize();
  }

  isMobileViewport(): boolean {
    const viewport = this.getViewportSize();
    return viewport ? viewport.width < 768 : false;
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
      console.log('Network idle timeout reached, continuing...');
    });
  }

  async takeScreenshot(name: string): Promise<void> {
    const fs = await import('fs');
    const path = await import('path');
    const screenshotsDir = path.resolve('screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    await this.page.screenshot({ path: path.join(screenshotsDir, `${name}.png`), fullPage: true });
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  async retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.log(`Attempt ${i + 1} failed: ${lastError.message}`);
        
        if (i < maxRetries - 1) {
          await this.page.waitForTimeout(1000 * (i + 1));
        }
      }
    }
    
    throw lastError!;
  }

  async safeClick(locator: Locator): Promise<void> {
    await this.retryOperation(async () => {
      await this.clickElement(locator);
    });
  }

  async waitForElementWithRetry(locator: Locator, timeout: number = 10000): Promise<void> {
    await this.retryOperation(async () => {
      await this.waitForElement(locator, timeout);
    });
  }
}