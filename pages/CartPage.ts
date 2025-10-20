import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage class handles interactions with the shopping cart page.
 * Manages cart item viewing, quantity verification, item removal, and checkout initiation.
 * Extends BasePage to inherit common page interaction methods.
 * 
 * @extends BasePage
 */
export class CartPage extends BasePage {
  /** Main cart table container element */
  private readonly cartTable: Locator;
  
  /** Collection of cart item rows for iteration and counting */
  private readonly cartItems: Locator;
  
  /** Button to initiate checkout process */
  private readonly proceedToCheckoutButton: Locator;
  
  /** Modal dialog that appears when user needs to register/login */
  private readonly registerLoginModal: Locator;
  
  /** Link to navigate to registration/login page */
  private readonly registerLoginButton: Locator;

  /**
   * Initializes the CartPage with all cart-related element locators.
   * Sets up locators for cart table, items, checkout controls, and authentication prompts.
   * 
   * @param page - The Playwright Page instance for browser interaction
   */
  constructor(page: Page) {
    super(page);
    
    // Main cart container and structure
    this.cartTable = page.locator('#cart_info_table');
    this.cartItems = page.locator('#cart_info tbody tr');
    
    // Checkout process controls
    this.proceedToCheckoutButton = page.locator('.btn.btn-default.check_out');
    
    // Authentication modal and navigation
    this.registerLoginModal = page.locator('.modal-content');
    this.registerLoginButton = page.locator('a[href="/login"]').first();
  }

  /**
   * Waits for the cart page to fully load and become interactive.
   * Ensures the cart table is visible before proceeding with cart operations.
   * Uses extended timeout for potentially slow page loads.
   * 
   * @returns Promise<void>
   */
  async waitForCartPage(): Promise<void> {
    await this.waitForElement(this.cartTable, 15000);
  }

  /**
   * Counts the total number of items currently in the shopping cart.
   * Handles empty cart scenarios gracefully by returning 0.
   * 
   * @returns Promise<number> The count of items in the cart (0 if empty or error)
   */
  async getCartItemCount(): Promise<number> {
    try {
      await this.waitForElement(this.cartItems.first(), 5000);
      return await this.cartItems.count();
    } catch {
      return 0;
    }
  }

  /**
   * Retrieves the quantity of a specific cart item.
   * Extracts and parses the quantity from the cart item's quantity button.
   * 
   * @param itemIndex - Index of the cart item (0-based, defaults to first item)
   * @returns Promise<number> The quantity of the specified cart item
   */
  async getItemQuantity(itemIndex: number = 0): Promise<number> {
    const item = this.cartItems.nth(itemIndex);
    const quantityButton = item.locator('.cart_quantity button');
    const quantityText = await this.getTextContent(quantityButton);
    return parseInt(quantityText, 10);
  }

  /**
   * Retrieves the name/title of a specific cart item.
   * Extracts the product name from the cart item's description area.
   * 
   * @param itemIndex - Index of the cart item (0-based, defaults to first item)
   * @returns Promise<string> The name of the specified cart item
   */
  async getItemName(itemIndex: number = 0): Promise<string> {
    const item = this.cartItems.nth(itemIndex);
    const nameElement = item.locator('.cart_description h4 a');
    return await this.getTextContent(nameElement);
  }

  /**
   * Retrieves the unit price of a specific cart item.
   * Gets the individual item price before quantity multiplication.
   * 
   * @param itemIndex - Index of the cart item (0-based, defaults to first item)
   * @returns Promise<string> The unit price of the specified cart item
   */
  async getItemPrice(itemIndex: number = 0): Promise<string> {
    const item = this.cartItems.nth(itemIndex);
    const priceElement = item.locator('.cart_price p');
    return await this.getTextContent(priceElement);
  }

  /**
   * Retrieves the total price of a specific cart item.
   * Gets the calculated total (unit price × quantity) for the item.
   * 
   * @param itemIndex - Index of the cart item (0-based, defaults to first item)
   * @returns Promise<string> The total price of the specified cart item
   */
  async getItemTotal(itemIndex: number = 0): Promise<string> {
    const item = this.cartItems.nth(itemIndex);
    const totalElement = item.locator('.cart_total_price');
    return await this.getTextContent(totalElement);
  }

  /**
   * Checks if the shopping cart is currently empty.
   * Convenient method to determine cart state for conditional logic.
   * 
   * @returns Promise<boolean> True if cart has no items, false otherwise
   */
  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  /**
   * Initiates the checkout process by clicking the proceed button.
   * Scrolls to ensure the checkout button is visible before clicking.
   * Includes brief wait for any immediate page reactions.
   * 
   * @returns Promise<void>
   */
  async proceedToCheckout(): Promise<void> {
    await this.scrollIntoView(this.proceedToCheckoutButton);
    await this.clickElement(this.proceedToCheckoutButton);
    
    // Brief wait for potential modal or navigation response
    await this.page.waitForTimeout(1000);
  }

  /**
   * Checks if the register/login modal is currently visible.
   * Handles both modal display and direct navigation to login page scenarios.
   * Used to determine if authentication is required before checkout.
   * 
   * @returns Promise<boolean> True if modal is visible or on login page, false otherwise
   */
  async isRegisterLoginModalVisible(): Promise<boolean> {
    try {
      // Brief wait for potential modal animation
      await this.page.waitForTimeout(500);
      
      const modalVisible = await this.isVisible(this.registerLoginModal);
      
      // Check if redirected to login page instead of showing modal
      const currentUrl = this.getCurrentUrl();
      const isLoginPage = currentUrl.includes('/login');
      
      return modalVisible || isLoginPage;
    } catch {
      return false;
    }
  }

  /**
   * Clicks the register/login link to navigate to authentication page.
   * Handles both modal-based and direct link scenarios for flexible navigation.
   * Waits for page load completion after navigation.
   * 
   * @returns Promise<void>
   */
  async clickRegisterLogin(): Promise<void> {
    // Try modal button first (preferred method)
    const modalButton = this.page.locator('.modal-body a[href="/login"]');
    const isModalButtonVisible = await this.isVisible(modalButton);
    
    if (isModalButtonVisible) {
      await this.clickElement(modalButton);
    } else {
      // Fallback to direct link if modal not available
      await this.clickElement(this.registerLoginButton);
    }
    
    await this.waitForPageLoad();
  }

  /**
   * Removes a specific item from the shopping cart.
   * Clicks the delete/remove button for the specified cart item.
   * Includes wait for cart update processing.
   * 
   * @param itemIndex - Index of the cart item to remove (0-based, defaults to first item)
   * @returns Promise<void>
   */
  async removeItem(itemIndex: number = 0): Promise<void> {
    const item = this.cartItems.nth(itemIndex);
    const removeButton = item.locator('.cart_quantity_delete');
    await this.clickElement(removeButton);
    
    // Wait for cart update to process
    await this.page.waitForTimeout(1000);
  }

  /**
   * Verifies that a cart item matches expected quantity and optionally name.
   * Comprehensive validation method for cart item verification in tests.
   * Handles errors gracefully by returning false for failed verifications.
   * 
   * @param expectedQuantity - Expected quantity value for the cart item
   * @param expectedName - Optional expected name to verify (partial match)
   * @returns Promise<boolean> True if verification passes, false otherwise
   */
  async verifyCartItem(expectedQuantity: number, expectedName?: string): Promise<boolean> {
    try {
      // Verify quantity matches expectation
      const actualQuantity = await this.getItemQuantity(0);
      
      if (actualQuantity !== expectedQuantity) {
        return false;
      }
      
      // Verify name if provided (allows partial matching)
      if (expectedName) {
        const actualName = await this.getItemName(0);
        return actualName.includes(expectedName);
      }
      
      return true;
    } catch {
      return false;
    }
  }
}