// Import Playwright types and base page class
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * PaymentPage class represents the payment processing page of the e-commerce application
 * This page handles credit card information input and payment confirmation
 * Extends BasePage to inherit common page functionality
 */
export class PaymentPage extends BasePage {
    // Locator for cardholder name input field
    private readonly nameOfCard: Locator;
    // Locator for credit card number input field
    private readonly cardNumber: Locator;
    // Locator for card verification code (CVC) input field
    private readonly cvc: Locator;
    // Locator for card expiration month dropdown/input
    private readonly expirationMonth: Locator;
    // Locator for card expiration year dropdown/input
    private readonly expirationYear: Locator;
    // Locator for the "Pay & Confirm Order" button
    private readonly payAndConfirmOrderBtn: Locator;
    // Locator for the success message after payment completion
    private readonly succesfulMessage: Locator;

    /**
     * Constructor initializes the PaymentPage with page instance and locators
     * @param page - Playwright Page instance for browser interaction
     */
    constructor(page: Page) {
        super(page);
        // Initialize payment form field locators using data-qa attributes for reliability
        this.nameOfCard = page.locator('[data-qa="name-on-card"]');
        this.cardNumber = page.locator('[data-qa="card-number"]');
        this.cvc = page.locator('[data-qa="cvc"]');
        this.expirationMonth = page.locator('[data-qa="expiry-month"]');
        this.expirationYear = page.locator('[data-qa="expiry-year"]');
        this.payAndConfirmOrderBtn = page.locator('[data-qa="pay-button"]');
        this.succesfulMessage = page.locator('[data-qa="order-placed"]');
    }

    /**
     * Fills the complete payment form with credit card information and submits payment
     * @param name - Cardholder name as it appears on the credit card
     * @param cardNumber - Credit card number (16 digits)
     * @param cvc - Card verification code (3-4 digits on back of card)
     * @param month - Expiration month (MM format)
     * @param year - Expiration year (YYYY format)
     * @returns Promise<void>
     */
    async fillPaymentForm(name: string, cardNumber: string, cvc: string, month: string, year: string): Promise<void> {
        // Fill cardholder name field
        await this.fillInput(this.nameOfCard, name);
        // Fill credit card number field
        await this.fillInput(this.cardNumber, cardNumber);
        // Fill card verification code field
        await this.fillInput(this.cvc, cvc);
        // Fill expiration month field
        await this.fillInput(this.expirationMonth, month);
        // Fill expiration year field
        await this.fillInput(this.expirationYear, year);

        // Submit the payment by clicking the pay button
        await this.clickElement(this.payAndConfirmOrderBtn);
    }

    /**
     * Retrieves the success message displayed after successful payment processing
     * @returns Promise<string> - The success message text (e.g., "Order Placed!")
     */
    async getSuccessfulMessage(): Promise<string> {
        return this.getTextContent(this.succesfulMessage);
    }
}