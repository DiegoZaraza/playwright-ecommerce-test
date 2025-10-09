import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;
  private readonly successModal: Locator;
  private readonly viewCartButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly productDetails: Locator;

  constructor(page: Page) {
    super(page);
    
    this.productName = page.locator('.product-information h2');
    this.productPrice = page.locator('.product-information span span');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
    this.successModal = page.locator('.modal-content');
    this.viewCartButton = page.locator('a:has-text("View Cart")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.productDetails = page.locator('.product-information');
  }

  async waitForProductDetailPage(): Promise<void> {
    await this.waitForElement(this.productDetails, 15000);
    await this.waitForElement(this.productName, 10000);
  }

  async getProductName(): Promise<string> {
    return await this.getTextContent(this.productName);
  }

  async getProductPrice(): Promise<string> {
    return await this.getTextContent(this.productPrice);
  }

  async getCurrentQuantity(): Promise<string> {
    return await this.quantityInput.inputValue();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.waitForElement(this.quantityInput, 10000);
    
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
    
    const setValue = await this.getCurrentQuantity();
    if (setValue !== quantity.toString()) {
      throw new Error(`Failed to set quantity. Expected: ${quantity}, Got: ${setValue}`);
    }
  }

  async addToCart(): Promise<void> {
    await this.scrollIntoView(this.addToCartButton);
    await this.clickElement(this.addToCartButton);
    
    await this.waitForElement(this.successModal, 10000);
  }

  async isSuccessModalVisible(): Promise<boolean> {
    return await this.isVisible(this.successModal);
  }

  async clickViewCart(): Promise<void> {
    await this.waitForElement(this.viewCartButton, 10000);
    await this.clickElement(this.viewCartButton);
    await this.waitForPageLoad();
  }

  async clickContinueShopping(): Promise<void> {
    await this.clickElement(this.continueShoppingButton);
    
    await this.page.waitForTimeout(500);
  }

  async getAvailability(): Promise<string> {
    const availabilityElement = this.page.locator('.product-information p:has-text("Availability")');
    return await this.getTextContent(availabilityElement);
  }

  async getCondition(): Promise<string> {
    const conditionElement = this.page.locator('.product-information p:has-text("Condition")');
    return await this.getTextContent(conditionElement);
  }

  async getBrand(): Promise<string> {
    const brandElement = this.page.locator('.product-information p:has-text("Brand")');
    return await this.getTextContent(brandElement);
  }

  async addProductToCart(quantity: number): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }
}