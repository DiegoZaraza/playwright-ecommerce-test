import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly productsLink: Locator;
  private readonly mobileMenuToggle: Locator;
  private readonly logo: Locator;
  private readonly header: Locator;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);
    
    this.productsLink = page.locator('a[href="/products"]').first();
    this.mobileMenuToggle = page.locator('.navbar-toggle');
    this.logo = page.locator('.logo');
    this.header = page.locator('header');
    this.cartLink = page.locator('a[href="/view_cart"]').first();
  }

  async navigate(): Promise<void> {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.logo, 15000);
      return true;
    } catch {
      return false;
    }
  }

  async navigateToProducts(): Promise<void> {
    if (this.isMobileViewport()) {
      await this.openMobileMenu();
    }
    
    await this.scrollIntoView(this.productsLink);
    await this.clickElement(this.productsLink);
    await this.waitForPageLoad();
  }

  async navigateToCart(): Promise<void> {
    if (this.isMobileViewport()) {
      await this.openMobileMenu();
    }
    
    await this.scrollIntoView(this.cartLink);
    await this.clickElement(this.cartLink);
    await this.waitForPageLoad();
  }

  private async openMobileMenu(): Promise<void> {
    const isMenuVisible = await this.isVisible(this.mobileMenuToggle);
    
    if (isMenuVisible) {
      await this.clickElement(this.mobileMenuToggle);
      await this.page.waitForTimeout(500);
    }
  }

  async getHeaderText(): Promise<string> {
    return await this.getTextContent(this.header);
  }

  async isLogoVisible(): Promise<boolean> {
    return await this.isVisible(this.logo);
  }
}