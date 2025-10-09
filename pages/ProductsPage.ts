import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly productsList: Locator;
  private readonly productItems: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator(".title.text-center");
    this.productsList = page.locator(".features_items");
    this.productItems = page.locator(".features_items .product-image-wrapper");
  }

  async waitForProductsPage(): Promise<void> {
    await this.waitForElement(this.pageTitle, 15000);
    await this.waitForElement(this.productsList, 10000);
  }

  async getProductCount(): Promise<number> {
    await this.waitForElement(this.productItems.first(), 10000);
    return await this.productItems.count();
  }

  async getProductName(index: number): Promise<string> {
    const product = this.productItems.nth(index);
    const nameElement = product.locator(".productinfo p");
    return await this.getTextContent(nameElement);
  }

  async getProductPrice(index: number): Promise<string> {
    const product = this.productItems.nth(index);
    const priceElement = product.locator(".productinfo h2");
    return await this.getTextContent(priceElement);
  }

  async viewProductByIndex(index: number): Promise<void> {
    await this.waitForElement(this.productItems.first(), 10000);

    const product = this.productItems.nth(index);

    await this.scrollIntoView(product);

    const viewButton = product.locator('a:has-text("View Product")');
    await this.clickElement(viewButton);

    await this.waitForPageLoad();
  }

  async viewThirdProduct(): Promise<void> {
    await this.viewProductByIndex(2);
  }

  async searchProduct(searchTerm: string): Promise<void> {
    const searchInput = this.page.locator("#search_product");
    const searchButton = this.page.locator("#submit_search");

    await this.fillInput(searchInput, searchTerm);
    await this.clickElement(searchButton);
    await this.waitForPageLoad();
  }

  async hasCorrectTitle(): Promise<boolean> {
    const titleText = await this.getTextContent(this.pageTitle);
    console.log(`Products page title: "${titleText}"`);
    return (
      titleText.includes("ALL PRODUCTS") || titleText.includes("All Products")
    );
  }

  async getAllProductNames(): Promise<string[]> {
    await this.waitForElement(this.productItems.first(), 10000);
    const count = await this.productItems.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await this.getProductName(i);
      names.push(name);
    }

    return names;
  }
}
