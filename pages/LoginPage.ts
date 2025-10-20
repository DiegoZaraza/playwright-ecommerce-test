// Import Playwright types and base page class
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage class represents the login/signup page of the e-commerce application
 * This page handles both user login and new user registration initiation
 * Extends BasePage to inherit common page functionality
 */
export class LoginPage extends BasePage {
    // Locator for the "New User Signup!" title/header
    private readonly signupUserTitle: Locator;
    // Locator for the name input field in signup form
    private readonly signupName: Locator;
    // Locator for the email input field in signup form
    private readonly signupEmail: Locator;
    // Locator for the signup button to proceed with registration
    private readonly signupButton: Locator;

    /**
     * Constructor initializes the LoginPage with page instance and locators
     * @param page - Playwright Page instance for browser interaction
     */
    constructor(page: Page) {
        super(page);
        // Initialize locators using data-qa attributes and text content for reliability
        this.signupUserTitle = page.locator('h2', { hasText: 'New User Signup!' });
        this.signupName = page.locator('[data-qa="signup-name"]');
        this.signupEmail = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');
    }

    /**
     * Waits for the login page to fully load by checking for the signup title
     * @returns Promise<void>
     */
    async waitForLoginPage(): Promise<void> {
        await this.waitForElement(this.signupUserTitle, 15000);
    }

    /**
     * Retrieves the signup section title text for verification purposes
     * @returns Promise<string> - The signup title text (e.g., "New User Signup!")
     */
    async getTitleSignUp(): Promise<string> {
        return this.getTextContent(this.signupUserTitle);
    }

    /**
     * Fills the initial signup form with name and email, then proceeds to detailed registration
     * This is the first step in the user registration process
     * @param name - User's full name for account creation
     * @param email - User's email address for account creation
     * @returns Promise<void>
     */
    async fillSignupForm(name: string, email: string): Promise<void> {
        // Fill the name field with provided user name
        await this.fillInput(this.signupName, name);
        // Fill the email field with provided email address
        await this.fillInput(this.signupEmail, email);
        // Click signup button to proceed to detailed registration form
        await this.clickElement(this.signupButton);
    }
}