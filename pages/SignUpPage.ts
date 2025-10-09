import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignUpPage extends BasePage {
    private readonly signUpTitle: Locator;
    //private readonly radioTitle: Locator;
    private readonly name: Locator;
    private readonly email: Locator;
    private readonly password: Locator;
    private readonly dobDay: Locator;
    private readonly dobMonth: Locator;
    private readonly dobYear: Locator;
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly company: Locator;
    private readonly address1: Locator;
    private readonly address2: Locator;
    private readonly country: Locator;
    private readonly state: Locator;
    private readonly city: Locator;
    private readonly zipcode: Locator;
    private readonly mobileNumber: Locator;
    private readonly createAccountButton: Locator;

    constructor(page: Page) {
        super(page);
        this.signUpTitle = page.locator('h2', { hasText: 'Enter Account Information' });
        this.name = page.locator('[data-qa="name"]');
        this.email = page.locator('[data-qa="email"]');
        this.password = page.locator('[data-qa="password"]');
        this.dobDay = page.locator('[data-qa="days"]');
        this.dobMonth = page.locator('[data-qa="months"]');
        this.dobYear = page.locator('[data-qa="years"]');
        this.firstName = page.locator('[data-qa="first_name"]');
        this.lastName = page.locator('[data-qa="last_name"]');
        this.company = page.locator('[data-qa="company"]');
        this.address1 = page.locator('[data-qa="address"]');
        this.address2 = page.locator('[data-qa="address2"]');
        this.country = page.locator('[data-qa="country"]');
        this.state = page.locator('[data-qa="state"]');
        this.city = page.locator('[data-qa="city"]');
        this.zipcode = page.locator('[data-qa="zipcode"]');
        this.mobileNumber = page.locator('[data-qa="mobile_number"]');
        this.createAccountButton = page.locator('[data-qa="create-account"]');
    }

    async getTitleSignUpPage(): Promise<string> {
        return this.getTextContent(this.signUpTitle);
    }

    async waitForSignUpPage(): Promise<void> {
        await this.waitForElement(this.signUpTitle, 15000);
    }

    async selectTitle(title: string): Promise<void> {
        const titleOption = this.page.locator(`input[value="${title}"]`);
        await this.clickElement(titleOption);
    }
    async selectDateOfBirth(day: string, month: string, year: string): Promise<void> {
        await this.selectOption(this.dobDay, day);
        await this.selectOption(this.dobMonth, month);
        await this.selectOption(this.dobYear, year);
    }

    async validateNameAndEmail(expectedName: string, expectedEmail: string): Promise<boolean> {
        const actualName = await this.name.inputValue();
        const actualEmail = await this.email.inputValue();
        return actualName === expectedName && actualEmail === expectedEmail;
    }

    async fillSignupForm(userData: {title: string, name: string, email: string, password: string, day: string, month: string, year: string, firstName: string, lastName: string, company: string, address1: string, address2: string, country: string, state: string, city: string, zipcode: string, mobileNumber: string}
    ): Promise<void> {
        await this.selectTitle(userData.title);
        await this.fillInput(this.password, userData.password);
        await this.selectDateOfBirth(userData.day, userData.month, userData.year);
        await this.fillInput(this.firstName, userData.firstName);
        await this.fillInput(this.lastName, userData.lastName);
        await this.fillInput(this.company, userData.company);
        await this.fillInput(this.address1, userData.address1);
        await this.fillInput(this.address2, userData.address2);
        await this.selectOption(this.country, userData.country);
        await this.fillInput(this.state, userData.state);
        await this.fillInput(this.city, userData.city);
        await this.fillInput(this.zipcode, userData.zipcode);
        await this.fillInput(this.mobileNumber, userData.mobileNumber);

        await this.clickElement(this.createAccountButton);
    }
}