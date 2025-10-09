import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    private readonly placeOrderBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.placeOrderBtn = page.locator('a[href="/payment"]').first();
    }

    async clickPlaceOrderButton(): Promise<void> {
        await this.clickElement(this.placeOrderBtn);
    }
}