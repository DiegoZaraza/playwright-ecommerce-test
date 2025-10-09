import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaymentPage extends BasePage {
    private readonly nameOfCard: Locator;
    private readonly cardNumber: Locator;
    private readonly cvc: Locator;
    private readonly expirationMonth: Locator;
    private readonly expirationYear: Locator;
    private readonly payAndConfirmOrderBtn: Locator
    private readonly succesfulMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.nameOfCard = page.locator('[data-qa="name-on-card"]');
        this.cardNumber = page.locator('[data-qa="card-number"]');
        this.cvc = page.locator('[data-qa="cvc"]');
        this.expirationMonth = page.locator('[data-qa="expiry-month"]');
        this.expirationYear = page.locator('[data-qa="expiry-year"]');
        this.payAndConfirmOrderBtn = page.locator('[data-qa="pay-button"]');
        this.succesfulMessage = page.locator('[data-qa="order-placed"]');
    }

    async fillPaymentForm(name: string, cardNumber: string, cvc: string, month: string, year: string): Promise<void> {
        await this.fillInput(this.nameOfCard, name);
        await this.fillInput(this.cardNumber, cardNumber);
        await this.fillInput(this.cvc, cvc);
        await this.fillInput(this.expirationMonth, month);
        await this.fillInput(this.expirationYear, year);

        await this.clickElement(this.payAndConfirmOrderBtn);
    }

    async getSuccessfulMessage(): Promise<string> {
        return this.getTextContent(this.succesfulMessage);
    }
}