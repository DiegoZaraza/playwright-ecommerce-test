import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SignUpPage class handles interactions with the account registration form page.
 * This page appears after initial user signup where detailed account information is collected.
 * Extends BasePage to inherit common page interaction methods.
 * 
 * @extends BasePage
 */
export class SignUpPage extends BasePage {
    /** Page title element indicating successful navigation to signup form */
    private readonly signUpTitle: Locator;
    
    /** Pre-populated user name field (from initial signup form) */
    private readonly name: Locator;
    
    /** Pre-populated email field (from initial signup form) */
    private readonly email: Locator;
    
    /** Password input field for account security */
    private readonly password: Locator;
    
    /** Day dropdown selector for date of birth */
    private readonly dobDay: Locator;
    
    /** Month dropdown selector for date of birth */
    private readonly dobMonth: Locator;
    
    /** Year dropdown selector for date of birth */
    private readonly dobYear: Locator;
    
    /** First name input field for personal information */
    private readonly firstName: Locator;
    
    /** Last name input field for personal information */
    private readonly lastName: Locator;
    
    /** Company name input field (optional business information) */
    private readonly company: Locator;
    
    /** Primary address line input field */
    private readonly address1: Locator;
    
    /** Secondary address line input field (apartment, suite, etc.) */
    private readonly address2: Locator;
    
    /** Country dropdown selector for address information */
    private readonly country: Locator;
    
    /** State/Province input field for address information */
    private readonly state: Locator;
    
    /** City input field for address information */
    private readonly city: Locator;
    
    /** ZIP/Postal code input field for address information */
    private readonly zipcode: Locator;
    
    /** Mobile phone number input field for contact information */
    private readonly mobileNumber: Locator;
    
    /** Submit button to create the user account */
    private readonly createAccountButton: Locator;

    /**
     * Initializes the SignUpPage with all form element locators.
     * Sets up locators for the comprehensive account registration form including
     * personal information, address details, and account credentials.
     * 
     * @param page - The Playwright Page instance for browser interaction
     */
    constructor(page: Page) {
        super(page);
        
        // Page identification and navigation elements
        this.signUpTitle = page.locator('h2', { hasText: 'Enter Account Information' });
        
        // Pre-populated user information (from initial signup)
        this.name = page.locator('[data-qa="name"]');
        this.email = page.locator('[data-qa="email"]');
        
        // Account security information
        this.password = page.locator('[data-qa="password"]');
        
        // Date of birth selection dropdowns
        this.dobDay = page.locator('[data-qa="days"]');
        this.dobMonth = page.locator('[data-qa="months"]');
        this.dobYear = page.locator('[data-qa="years"]');
        
        // Personal information fields
        this.firstName = page.locator('[data-qa="first_name"]');
        this.lastName = page.locator('[data-qa="last_name"]');
        this.company = page.locator('[data-qa="company"]');
        
        // Address information fields
        this.address1 = page.locator('[data-qa="address"]');
        this.address2 = page.locator('[data-qa="address2"]');
        this.country = page.locator('[data-qa="country"]');
        this.state = page.locator('[data-qa="state"]');
        this.city = page.locator('[data-qa="city"]');
        this.zipcode = page.locator('[data-qa="zipcode"]');
        
        // Contact information
        this.mobileNumber = page.locator('[data-qa="mobile_number"]');
        
        // Form submission
        this.createAccountButton = page.locator('[data-qa="create-account"]');
    }

    /**
     * Retrieves the title text from the signup page header.
     * Used to verify successful navigation to the account registration form.
     * 
     * @returns Promise<string> The text content of the signup page title
     */
    async getTitleSignUpPage(): Promise<string> {
        return this.getTextContent(this.signUpTitle);
    }

    /**
     * Waits for the signup page to fully load and become interactive.
     * Ensures the page title is visible before proceeding with form interactions.
     * Uses extended timeout for potentially slow page loads.
     * 
     * @returns Promise<void>
     */
    async waitForSignUpPage(): Promise<void> {
        await this.waitForElement(this.signUpTitle, 15000);
    }

    /**
     * Selects the user's title/gender option (Mr./Mrs./Miss).
     * Clicks the appropriate radio button based on the provided title value.
     * 
     * @param title - The title to select (e.g., "Mr", "Mrs", "Miss")
     * @returns Promise<void>
     */
    async selectTitle(title: string): Promise<void> {
        const titleOption = this.page.locator(`input[value="${title}"]`);
        await this.clickElement(titleOption);
    }

    /**
     * Selects the complete date of birth using dropdown menus.
     * Sequentially selects day, month, and year from their respective dropdowns.
     * 
     * @param day - Day of birth (e.g., "15")
     * @param month - Month of birth (e.g., "January", "March")
     * @param year - Year of birth (e.g., "1990")
     * @returns Promise<void>
     */
    async selectDateOfBirth(day: string, month: string, year: string): Promise<void> {
        await this.selectOption(this.dobDay, day);
        await this.selectOption(this.dobMonth, month);
        await this.selectOption(this.dobYear, year);
    }

    /**
     * Validates that name and email fields contain expected pre-populated values.
     * Verifies that data from the initial signup form is correctly carried forward.
     * Used for data integrity checks during the registration process.
     * 
     * @param expectedName - Expected name value that should be pre-filled
     * @param expectedEmail - Expected email value that should be pre-filled
     * @returns Promise<boolean> True if both values match expectations, false otherwise
     */
    async validateNameAndEmail(expectedName: string, expectedEmail: string): Promise<boolean> {
        const actualName = await this.name.inputValue();
        const actualEmail = await this.email.inputValue();
        return actualName === expectedName && actualEmail === expectedEmail;
    }

    /**
     * Fills out the complete user registration form with provided data.
     * Handles all form fields including personal information, address details,
     * and contact information, then submits the form to create the account.
     * 
     * @param userData - Object containing all user registration data:
     *   - title: User's title/gender (Mr/Mrs/Miss)
     *   - name: Full name (pre-populated, not filled here)
     *   - email: Email address (pre-populated, not filled here)
     *   - password: Account password
     *   - day/month/year: Date of birth components
     *   - firstName/lastName: Personal name components
     *   - company: Company name (optional)
     *   - address1/address2: Address line components
     *   - country/state/city: Location information
     *   - zipcode: Postal code
     *   - mobileNumber: Contact phone number
     * @returns Promise<void>
     */
    async fillSignupForm(userData: {title: string, name: string, email: string, password: string, day: string, month: string, year: string, firstName: string, lastName: string, company: string, address1: string, address2: string, country: string, state: string, city: string, zipcode: string, mobileNumber: string}
    ): Promise<void> {
        // Select user title/gender
        await this.selectTitle(userData.title);
        
        // Fill account security information
        await this.fillInput(this.password, userData.password);
        
        // Set date of birth
        await this.selectDateOfBirth(userData.day, userData.month, userData.year);
        
        // Fill personal information
        await this.fillInput(this.firstName, userData.firstName);
        await this.fillInput(this.lastName, userData.lastName);
        await this.fillInput(this.company, userData.company);
        
        // Fill address information
        await this.fillInput(this.address1, userData.address1);
        await this.fillInput(this.address2, userData.address2);
        await this.selectOption(this.country, userData.country);
        await this.fillInput(this.state, userData.state);
        await this.fillInput(this.city, userData.city);
        await this.fillInput(this.zipcode, userData.zipcode);
        
        // Fill contact information
        await this.fillInput(this.mobileNumber, userData.mobileNumber);

        // Submit the form to create the account
        await this.clickElement(this.createAccountButton);
    }
}