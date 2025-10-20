import { Page, Locator } from '@playwright/test';

/**
 * BasePage class provides common functionality for all page object classes.
 * Contains shared methods for page interactions, element waiting, error handling, and utilities.
 * Serves as the foundation for the Page Object Model pattern implementation.
 * 
 * All specific page classes should extend this base class to inherit common functionality
 * and ensure consistent behavior across the test framework.
 * 
 * @class BasePage
 */
export class BasePage {
  /** The Playwright Page instance for browser interactions */
  readonly page: Page;

  /**
   * Initializes the BasePage with a Playwright Page instance.
   * 
   * @param page - The Playwright Page instance for browser interaction
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the specified URL with enhanced loading strategies.
   * Waits for DOM content to load and uses extended timeout for slow connections.
   * 
   * @param url - The URL to navigate to (relative or absolute)
   * @returns Promise<void>
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
  }

  /**
   * Waits for an element to become visible within the specified timeout.
   * Essential method for ensuring elements are ready for interaction.
   * 
   * @param locator - The Playwright locator for the element
   * @param timeout - Maximum wait time in milliseconds (default: 10000)
   * @returns Promise<void>
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Safely clicks an element after ensuring it's visible and attached to the DOM.
   * Uses non-forced clicks to simulate realistic user interactions.
   * 
   * @param locator - The Playwright locator for the element to click
   * @returns Promise<void>
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.waitFor({ state: 'attached' });
    await locator.click({ force: false });
  }

  /**
   * Selects an option from a dropdown/select element.
   * Waits for the element to be visible before making the selection.
   * 
   * @param locator - The Playwright locator for the select element
   * @param value - The value to select from the dropdown
   * @returns Promise<void>
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  /**
   * Fills an input field with the specified text.
   * Clears existing content before filling to ensure clean input.
   * 
   * @param locator - The Playwright locator for the input element
   * @param text - The text to fill into the input field
   * @returns Promise<void>
   */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(''); // Clear existing content
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