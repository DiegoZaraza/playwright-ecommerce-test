import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartTable: Locator;
  private readonly cartItems: Locator;
  private readonly proceedToCheckoutButton: Locator;
  private readonly registerLoginModal: Locator;
  private readonly registerLoginButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.cartTable = page.locator('#cart_info_table');
    this.cartItems = page.locator('#cart_info tbody tr');
    this.proceedToCheckoutButton = page.locator('.btn.btn-default.check_out');
    this.registerLoginModal = page.locator('.modal-content');
    this.registerLoginButton = page.locator('a[href="/login"]').first();
  }

  async waitForCartPage(): Promise<void> {
    await this.waitForElement(this.cartTable, 15000);
  }

  async getCartItemCount(): Promise<number> {
    try {
      await this.waitForElement(this.cartItems.first(), 5000);
      return await this.cartItems.count();
    } catch {
      return 0;
    }
  }

  async getItemQuantity(itemIndex: number = 0): Promise<number> {
    const item = this.cartItems.nth(itemIndex);
    const quantityButton = item.locator('.cart_quantity button');
    const quantityText = await this.getTextContent(quantityButton);
    return parseInt(quantityText, 10);
  }

  async getItemName(itemIndex: number = 0): Promise<string> {
    const item = this.cartItems.nth(itemIndex);
    const nameElement = item.locator('.cart_description h4 a');
    return await this.getTextContent(nameElement);
  }

  async getItemPrice(itemIndex: number = 0): Promise<string> {
    const item = this.cartItems.nth(itemIndex);
    const priceElement = item.locator('.cart_price p');
    return await this.getTextContent(priceElement);
  }

  async getItemTotal(itemIndex: number = 0): Promise<string> {
    const item = this.cartItems.nth(itemIndex);
    const totalElement = item.locator('.cart_total_price');
    return await this.getTextContent(totalElement);
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  async proceedToCheckout(): Promise<void> {
    await this.scrollIntoView(this.proceedToCheckoutButton);
    await this.clickElement(this.proceedToCheckoutButton);
    
    await this.page.waitForTimeout(1000);
  }

  async isRegisterLoginModalVisible(): Promise<boolean> {
    try {
      await this.page.waitForTimeout(500);
      
      const modalVisible = await this.isVisible(this.registerLoginModal);
      
      const currentUrl = this.getCurrentUrl();
      const isLoginPage = currentUrl.includes('/login');
      
      return modalVisible || isLoginPage;
    } catch {
      return false;
    }
  }

  async clickRegisterLogin(): Promise<void> {
    const modalButton = this.page.locator('.modal-body a[href="/login"]');
    const isModalButtonVisible = await this.isVisible(modalButton);
    
    if (isModalButtonVisible) {
      await this.clickElement(modalButton);
    } else {
      await this.clickElement(this.registerLoginButton);
    }
    
    await this.waitForPageLoad();
  }

  async removeItem(itemIndex: number = 0): Promise<void> {
    const item = this.cartItems.nth(itemIndex);
    const removeButton = item.locator('.cart_quantity_delete');
    await this.clickElement(removeButton);
    await this.page.waitForTimeout(1000);
  }

  async verifyCartItem(expectedQuantity: number, expectedName?: string): Promise<boolean> {
    try {
      const actualQuantity = await this.getItemQuantity(0);
      
      if (actualQuantity !== expectedQuantity) {
        return false;
      }
      
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