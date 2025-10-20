import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage class handles interactions with the main landing page of the e-commerce site.
 * Manages navigation to key sections, mobile menu handling, and page loading verification.
 * Extends BasePage to inherit common page interaction methods.
 * 
 * @extends BasePage
 */
export class HomePage extends BasePage {
  /** Navigation link to the products page */
  private readonly productsLink: Locator;
  
  /** Mobile hamburger menu toggle button */
  private readonly mobileMenuToggle: Locator;
  
  /** Site logo element for page identification */
  private readonly logo: Locator;
  
  /** Header section container */
  private readonly header: Locator;
  
  /** Navigation link to the shopping cart page */
  private readonly cartLink: Locator;

  /**
   * Initializes the HomePage with all navigation and identification element locators.
   * Sets up locators for main navigation links, mobile menu controls, and page identification.
   * 
   * @param page - The Playwright Page instance for browser interaction
   */
  constructor(page: Page) {
    super(page);
    
    // Navigation links (using .first() to handle multiple instances)
    this.productsLink = page.locator('a[href="/products"]').first();
    this.cartLink = page.locator('a[href="/view_cart"]').first();
    
    // Mobile responsiveness elements
    this.mobileMenuToggle = page.locator('.navbar-toggle');
    
    // Page identification elements
    this.logo = page.locator('.logo');
    this.header = page.locator('header');
  }

  /**
   * Navigates to the home page of the e-commerce site.
   * Goes to the root URL and waits for the page to load completely.
   * 
   * @returns Promise<void>
   */
  async navigate(): Promise<void> {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Checks if the home page has loaded successfully.
   * Verifies that the logo element is visible within the timeout period.
   * 
   * @returns Promise<boolean> True if page is loaded, false otherwise
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.waitForElement(this.logo, 15000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Navigates to the products page from the home page.
   * Handles both desktop and mobile viewport navigation by opening mobile menu if needed.
   * Scrolls the products link into view for reliable clicking.
   * 
   * @returns Promise<void>
   */
  async navigateToProducts(): Promise<void> {
    // Handle mobile menu if in mobile viewport
    if (this.isMobileViewport()) {
      await this.openMobileMenu();
    }
    
    // Navigate to products page
    await this.scrollIntoView(this.productsLink);
    await this.clickElement(this.productsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigates to the shopping cart page from the home page.
   * Handles both desktop and mobile viewport navigation by opening mobile menu if needed.
   * Scrolls the cart link into view for reliable clicking.
   * 
   * @returns Promise<void>
   */
  async navigateToCart(): Promise<void> {
    // Handle mobile menu if in mobile viewport
    if (this.isMobileViewport()) {
      await this.openMobileMenu();
    }
    
    // Navigate to cart page
    await this.scrollIntoView(this.cartLink);
    await this.clickElement(this.cartLink);
    await this.waitForPageLoad();
  }

  /**
   * Opens the mobile hamburger menu for navigation access.
   * Private method used internally for mobile viewport navigation.
   * Includes brief wait for menu animation to complete.
   * 
   * @returns Promise<void>
   * @private
   */
  private async openMobileMenu(): Promise<void> {
    const isMenuVisible = await this.isVisible(this.mobileMenuToggle);
    
    if (isMenuVisible) {
      await this.clickElement(this.mobileMenuToggle);
      // Wait for menu animation to complete
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Retrieves the text content from the header section.
   * Can be used for header validation or extracting header information.
   * 
   * @returns Promise<string> The text content of the header
   */
  async getHeaderText(): Promise<string> {
    return await this.getTextContent(this.header);
  }

  /**
   * Checks if the site logo is currently visible.
   * Useful for verifying successful page load and branding visibility.
   * 
   * @returns Promise<boolean> True if logo is visible, false otherwise
   */
  async isLogoVisible(): Promise<boolean> {
    return await this.isVisible(this.logo);
  }
}