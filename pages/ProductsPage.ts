import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * ProductsPage class handles interactions with the products listing page.
 * Manages product viewing, searching, and selection functionality.
 * Extends BasePage to inherit common page interaction methods.
 * 
 * @extends BasePage
 */
export class ProductsPage extends BasePage {
  /** Page title element for products page identification */
  private readonly pageTitle: Locator;
  
  /** Container for the entire products listing */
  private readonly productsList: Locator;
  
  /** Collection of individual product items for iteration */
  private readonly productItems: Locator;

  /**
   * Initializes the ProductsPage with all product-related element locators.
   * Sets up locators for page identification, product listing, and individual product items.
   * 
   * @param page - The Playwright Page instance for browser interaction
   */
  constructor(page: Page) {
    super(page);

    // Page identification and structure
    this.pageTitle = page.locator(".title.text-center");
    this.productsList = page.locator(".features_items");
    
    // Individual product items for interaction
    this.productItems = page.locator(".features_items .product-image-wrapper");
  }

  /**
   * Waits for the products page to fully load and become interactive.
   * Ensures both page title and products list are visible before proceeding.
   * Uses extended timeouts for potentially slow page loads with many products.
   * 
   * @returns Promise<void>
   */
  async waitForProductsPage(): Promise<void> {
    await this.waitForElement(this.pageTitle, 15000);
    await this.waitForElement(this.productsList, 10000);
  }

  /**
   * Counts the total number of products displayed on the page.
   * Waits for at least one product to be visible before counting.
   * 
   * @returns Promise<number> The total count of products on the page
   */
  async getProductCount(): Promise<number> {
    await this.waitForElement(this.productItems.first(), 10000);
    return await this.productItems.count();
  }

  /**
   * Retrieves the name of a specific product by its index position.
   * Extracts product name from the product information section.
   * 
   * @param index - Zero-based index of the product in the list
   * @returns Promise<string> The name of the specified product
   */
  async getProductName(index: number): Promise<string> {
    const product = this.productItems.nth(index);
    const nameElement = product.locator(".productinfo p");
    return await this.getTextContent(nameElement);
  }

  /**
   * Retrieves the price of a specific product by its index position.
   * Extracts product price from the product information section.
   * 
   * @param index - Zero-based index of the product in the list
   * @returns Promise<string> The price of the specified product
   */
  async getProductPrice(index: number): Promise<string> {
    const product = this.productItems.nth(index);
    const priceElement = product.locator(".productinfo h2");
    return await this.getTextContent(priceElement);
  }

  /**
   * Navigates to the detailed view of a specific product.
   * Scrolls the product into view and clicks the "View Product" button.
   * Waits for the product detail page to load completely.
   * 
   * @param index - Zero-based index of the product to view
   * @returns Promise<void>
   */
  async viewProductByIndex(index: number): Promise<void> {
    // Ensure products are loaded before interaction
    await this.waitForElement(this.productItems.first(), 10000);

    const product = this.productItems.nth(index);

    // Scroll product into view for reliable interaction
    await this.scrollIntoView(product);

    // Click the view product button
    const viewButton = product.locator('a:has-text("View Product")');
    await this.clickElement(viewButton);

    // Wait for navigation to product detail page
    await this.waitForPageLoad();
  }

  /**
   * Convenience method to view the third product in the list.
   * Uses zero-based indexing, so views product at index 2.
   * Commonly used shortcut for test scenarios.
   * 
   * @returns Promise<void>
   */
  async viewThirdProduct(): Promise<void> {
    await this.viewProductByIndex(2);
  }

  /**
   * Searches for products using the search functionality.
   * Fills the search input with the provided term and submits the search.
   * Waits for search results page to load.
   * 
   * @param searchTerm - The search term to look for products
   * @returns Promise<void>
   */
  async searchProduct(searchTerm: string): Promise<void> {
    const searchInput = this.page.locator("#search_product");
    const searchButton = this.page.locator("#submit_search");

    // Fill search term and submit
    await this.fillInput(searchInput, searchTerm);
    await this.clickElement(searchButton);
    
    // Wait for search results to load
    await this.waitForPageLoad();
  }

  /**
   * Validates that the page has the correct products page title.
   * Checks for various possible title formats ("ALL PRODUCTS", "All Products").
   * Includes console logging for debugging title verification issues.
   * 
   * @returns Promise<boolean> True if title indicates products page, false otherwise
   */
  async hasCorrectTitle(): Promise<boolean> {
    const titleText = await this.getTextContent(this.pageTitle);
    console.log(`Products page title: "${titleText}"`);
    return (
      titleText.includes("ALL PRODUCTS") || titleText.includes("All Products")
    );
  }

  /**
   * Retrieves names of all products currently displayed on the page.
   * Iterates through all product items and collects their names.
   * Useful for comprehensive product listing verification.
   * 
   * @returns Promise<string[]> Array containing names of all products on the page
   */
  async getAllProductNames(): Promise<string[]> {
    // Ensure products are loaded before collecting names
    await this.waitForElement(this.productItems.first(), 10000);
    const count = await this.productItems.count();
    const names: string[] = [];

    // Collect all product names
    for (let i = 0; i < count; i++) {
      const name = await this.getProductName(i);
      names.push(name);
    }

    return names;
  }
}
