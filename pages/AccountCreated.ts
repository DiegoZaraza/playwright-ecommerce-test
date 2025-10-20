import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AccountCreatedPage class handles interactions with the account creation confirmation page.
 * This page appears after successful user registration to confirm account creation.
 * Extends BasePage to inherit common page interaction methods.
 * 
 * @extends BasePage
 */
export class AccountCreatedPage extends BasePage {
  /** Main title element confirming account creation */
  private readonly accountCreatedTitle: Locator;
  
  /** Button to continue after account creation confirmation */
  private readonly continueButton: Locator;
  
  /** Success message displayed on the page */
  private readonly successMessage: Locator;

  /**
   * Initializes the AccountCreatedPage with confirmation page element locators.
   * Sets up locators for account creation confirmation elements and navigation controls.
   * 
   * @param page - The Playwright Page instance for browser interaction
   */
  constructor(page: Page) {
    super(page);
    
    // Account creation confirmation elements
    this.accountCreatedTitle = page.locator('[data-qa="account-created"]');
    this.successMessage = page.locator('.title.text-center');
    
    // Navigation controls
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  /**
   * Waits for the account created confirmation page to fully load.
   * Ensures the account creation title is visible before proceeding.
   * Uses extended timeout for potential server processing delays.
   * 
   * @returns Promise<void>
   */
  async waitForAccountCreatedPage(): Promise<void> {
    await this.waitForElement(this.accountCreatedTitle, 15000);
  }

  /**
   * Retrieves the account created confirmation title text.
   * Waits for the title element to be available before extracting text.
   * Used for verification that account creation was successful.
   * 
   * @returns Promise<string> The account created title text
   */
  async getAccountCreatedTitle(): Promise<string> {
    await this.waitForElement(this.accountCreatedTitle);
    return this.getTextContent(this.accountCreatedTitle);
  }

  /**
   * Retrieves the success message text from the confirmation page.
   * Waits for the success message element to be available before extracting text.
   * Provides additional confirmation details about the account creation.
   * 
   * @returns Promise<string> The success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForElement(this.successMessage);
    return this.getTextContent(this.successMessage);
  }

  /**
   * Clicks the continue button to proceed after account creation.
   * Scrolls the button into view for reliable interaction and waits for navigation.
   * Typically navigates back to the home page or login area.
   * 
   * @returns Promise<void>
   */
  async clickContinue(): Promise<void> {
    await this.scrollIntoView(this.continueButton);
    await this.clickElement(this.continueButton);
    await this.waitForPageLoad();
  }

  /**
   * Checks if the account has been successfully created.
   * Verifies the presence of the account created title element.
   * Returns false if the element is not found within the timeout period.
   * 
   * @returns Promise<boolean> True if account creation is confirmed, false otherwise
   */
  async isAccountCreated(): Promise<boolean> {
    try {
      await this.waitForElement(this.accountCreatedTitle, 5000);
      return true;
    } catch {
      return false;
    }
  }
}