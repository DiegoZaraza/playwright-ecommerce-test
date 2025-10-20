import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailPage class handles interactions with individual product detail pages.
 * Manages product information viewing, quantity selection, and adding items to cart.
 * Extends BasePage to inherit common page interaction methods.
 * 
 * @extends BasePage
 */
export class ProductDetailPage extends BasePage {
  /** Product name/title display element */
  private readonly productName: Locator;
  
  /** Product price display element */
  private readonly productPrice: Locator;
  
  /** Quantity input field for specifying item count */
  private readonly quantityInput: Locator;
  
  /** Button to add the product to shopping cart */
  private readonly addToCartButton: Locator;
  
  /** Success modal that appears after adding item to cart */
  private readonly successModal: Locator;
  
  /** Button in success modal to navigate to cart page */
  private readonly viewCartButton: Locator;
  
  /** Button in success modal to continue shopping */
  private readonly continueShoppingButton: Locator;
  
  /** Container for all product detail information */
  private readonly productDetails: Locator;

  /**
   * Initializes the ProductDetailPage with all product detail element locators.
   * Sets up locators for product information, cart interaction, and modal handling.
   * 
   * @param page - The Playwright Page instance for browser interaction
   */
  constructor(page: Page) {
    super(page);
    
    // Product information elements
    this.productName = page.locator('.product-information h2');
    this.productPrice = page.locator('.product-information span span');
    this.productDetails = page.locator('.product-information');
    
    // Cart interaction elements
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
    
    // Post-add-to-cart modal elements
    this.successModal = page.locator('.modal-content');
    this.viewCartButton = page.locator('a:has-text("View Cart")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
  }

  /**
   * Waits for the product detail page to fully load and become interactive.
   * Ensures both product details container and product name are visible.
   * Uses extended timeout for potentially slow product image loading.
   * 
   * @returns Promise<void>
   */
  async waitForProductDetailPage(): Promise<void> {
    await this.waitForElement(this.productDetails, 15000);
    await this.waitForElement(this.productName, 10000);
  }

  /**
   * Retrieves the name/title of the current product.
   * Extracts the product name from the product information section.
   * 
   * @returns Promise<string> The name of the product
   */
  async getProductName(): Promise<string> {
    return await this.getTextContent(this.productName);
  }

  /**
   * Retrieves the price of the current product.
   * Extracts the product price from the product information section.
   * 
   * @returns Promise<string> The price of the product
   */
  async getProductPrice(): Promise<string> {
    return await this.getTextContent(this.productPrice);
  }

  /**
   * Gets the currently selected quantity value from the quantity input field.
   * Returns the current input value as a string.
   * 
   * @returns Promise<string> The current quantity value
   */
  async getCurrentQuantity(): Promise<string> {
    return await this.quantityInput.inputValue();
  }

  /**
   * Sets the desired quantity for the product.
   * Clears the existing value and enters the new quantity.
   * Includes validation to ensure the value was set correctly.
   * 
   * @param quantity - The desired quantity number
   * @returns Promise<void>
   * @throws Error if the quantity could not be set correctly
   */
  async setQuantity(quantity: number): Promise<void> {
    await this.waitForElement(this.quantityInput, 10000);
    
    // Clear existing value and set new quantity
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
    
    // Validate the quantity was set correctly
    const setValue = await this.getCurrentQuantity();
    if (setValue !== quantity.toString()) {
      throw new Error(`Failed to set quantity. Expected: ${quantity}, Got: ${setValue}`);
    }
  }

  /**
   * Adds the product to the shopping cart with current quantity.
   * Scrolls the add to cart button into view and clicks it.
   * Waits for the success modal to appear confirming the action.
   * 
   * @returns Promise<void>
   */
  async addToCart(): Promise<void> {
    await this.scrollIntoView(this.addToCartButton);
    await this.clickElement(this.addToCartButton);
    
    // Wait for success modal to confirm addition
    await this.waitForElement(this.successModal, 10000);
  }

  /**
   * Checks if the success modal is currently visible.
   * Used to verify that the add to cart action was successful.
   * 
   * @returns Promise<boolean> True if success modal is visible, false otherwise
   */
  async isSuccessModalVisible(): Promise<boolean> {
    return await this.isVisible(this.successModal);
  }

  /**
   * Clicks the "View Cart" button in the success modal.
   * Navigates to the shopping cart page after adding an item.
   * Waits for the cart page to load completely.
   * 
   * @returns Promise<void>
   */
  async clickViewCart(): Promise<void> {
    await this.waitForElement(this.viewCartButton, 10000);
    await this.clickElement(this.viewCartButton);
    await this.waitForPageLoad();
  }

  /**
   * Clicks the "Continue Shopping" button in the success modal.
   * Closes the modal and allows continued shopping without navigating away.
   * Includes brief wait for modal to close.
   * 
   * @returns Promise<void>
   */
  async clickContinueShopping(): Promise<void> {
    await this.clickElement(this.continueShoppingButton);
    
    // Brief wait for modal to close
    await this.page.waitForTimeout(500);
  }

  /**
   * Retrieves the availability status of the current product.
   * Extracts availability information from the product details section.
   * 
   * @returns Promise<string> The availability status text
   */
  async getAvailability(): Promise<string> {
    const availabilityElement = this.page.locator('.product-information p:has-text("Availability")');
    return await this.getTextContent(availabilityElement);
  }

  /**
   * Retrieves the condition information of the current product.
   * Extracts condition details from the product information section.
   * 
   * @returns Promise<string> The product condition text
   */
  async getCondition(): Promise<string> {
    const conditionElement = this.page.locator('.product-information p:has-text("Condition")');
    return await this.getTextContent(conditionElement);
  }

  /**
   * Retrieves the brand information of the current product.
   * Extracts brand details from the product information section.
   * 
   * @returns Promise<string> The product brand text
   */
  async getBrand(): Promise<string> {
    const brandElement = this.page.locator('.product-information p:has-text("Brand")');
    return await this.getTextContent(brandElement);
  }

  /**
   * Convenience method to set quantity and add product to cart in one action.
   * Combines quantity setting and cart addition for streamlined test workflows.
   * 
   * @param quantity - The desired quantity to add to cart
   * @returns Promise<void>
   */
  async addProductToCart(quantity: number): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }
}