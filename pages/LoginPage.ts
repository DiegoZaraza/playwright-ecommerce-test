import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    private readonly signupUserTitle: Locator;
    private readonly signupName: Locator;
    private readonly signupEmail: Locator;
    private readonly signupButton: Locator;

    constructor(page: Page) {
        super(page);
        this.signupUserTitle = page.locator('h2', { hasText: 'New User Signup!' });
        this.signupName = page.locator('[data-qa="signup-name"]');
        this.signupEmail = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');
    }

    async waitForLoginPage(): Promise<void> {
        await this.waitForElement(this.signupUserTitle, 15000);
    }

    async getTitleSignUp(): Promise<string> {
        return this.getTextContent(this.signupUserTitle);
    }

    async fillSignupForm(name: string, email: string): Promise<void> {
        await this.fillInput(this.signupName, name);
        await this.fillInput(this.signupEmail, email);
        await this.clickElement(this.signupButton);
    }
}