// Import Playwright types and base page class
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutPage class represents the checkout page of the e-commerce application
 * This page allows users to review their order and proceed to payment
 * Extends BasePage to inherit common page functionality
 */
export class CheckoutPage extends BasePage {
    // Locator for the "Place Order" button that leads to payment page
    private readonly placeOrderBtn: Locator;

    /**
     * Constructor initializes the CheckoutPage with page instance and locators
     * @param page - Playwright Page instance for browser interaction
     */
    constructor(page: Page) {
        super(page);
        // Initialize the "Place Order" button locator using href attribute
        this.placeOrderBtn = page.locator('a[href="/payment"]').first();
    }

    /**
     * Clicks the "Place Order" button to proceed to payment page
     * This action finalizes the checkout process and navigates to payment
     * @returns Promise<void>
     */
    async clickPlaceOrderButton(): Promise<void> {
        await this.clickElement(this.placeOrderBtn);
    }
}