import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountCreatedPage extends BasePage {
  private readonly accountCreatedTitle: Locator;
  private readonly continueButton: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    this.accountCreatedTitle = page.locator('[data-qa="account-created"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
    this.successMessage = page.locator('.title.text-center');
  }

  async waitForAccountCreatedPage(): Promise<void> {
    await this.waitForElement(this.accountCreatedTitle, 15000);
  }

  async getAccountCreatedTitle(): Promise<string> {
    await this.waitForElement(this.accountCreatedTitle);
    return this.getTextContent(this.accountCreatedTitle);
  }

  async getSuccessMessage(): Promise<string> {
    await this.waitForElement(this.successMessage);
    return this.getTextContent(this.successMessage);
  }

  async clickContinue(): Promise<void> {
    await this.scrollIntoView(this.continueButton);
    await this.clickElement(this.continueButton);
    await this.waitForPageLoad();
  }

  async isAccountCreated(): Promise<boolean> {
    try {
      await this.waitForElement(this.accountCreatedTitle, 5000);
      return true;
    } catch {
      return false;
    }
  }
}