import { faker } from '@faker-js/faker';

/**
 * DataGenerator class provides comprehensive test data generation utilities.
 * Utilizes Faker.js to create realistic, randomized data for e-commerce testing scenarios.
 * Includes methods for user data, payment information, dates, and various test scenarios.
 * 
 * @class DataGenerator
 */
export class DataGenerator {
  
  /**
   * Generates a random quantity within the specified range.
   * Commonly used for product quantity selection in cart and checkout scenarios.
   * 
   * @param min - Minimum quantity value (default: 1)
   * @param max - Maximum quantity value (default: 20)
   * @returns Random integer within the specified range
   */
  static generateRandomQuantity(min: number = 1, max: number = 20): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generates comprehensive user data for registration and purchase scenarios.
   * Creates a complete user profile including personal information, address, and payment details.
   * Uses gender-appropriate names and titles for realistic test data.
   * 
   * @returns Object containing all user data fields needed for registration and checkout
   */
  static generateUserData() {
    // Generate gender-appropriate names and titles
    const genre = faker.helpers.arrayElement(['male', 'female']);
    const firstName = faker.person.firstName(genre);
    const lastName = faker.person.lastName();
    const password = faker.internet.password({ length: 12 });
    
    // Generate associated data
    const dateofBirth = this.generateDateOfBirth();
    const creditCard = this.generateCreditCard();
    
    return {
      // Basic identity information
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      title: genre === 'male' ? 'Mr' : 'Mrs',
      password: password,
      firstName: firstName,
      lastName: lastName,
      
      // Date of birth components
      day: dateofBirth.day,
      month: dateofBirth.month,
      year: dateofBirth.year,
      
      // Address and contact information
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: faker.helpers.arrayElement(['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.phone.number(),
      
      // Payment information
      cardNumber: creditCard.number,
      cvv: creditCard.cvv,
      expiryMonth: creditCard.expiryMonth,
      expiryYear: creditCard.expiryYear
    };
  }

  /**
   * Generates a realistic date of birth for adult users.
   * Creates birth dates for users aged 18-80 years and formats them as strings.
   * Returns separate day, month, and year components for form filling.
   * 
   * @returns Object with day, month, and year as strings
   */
  static generateDateOfBirth() {
    const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
    
    return {
      day: birthDate.getDate().toString(),
      month: (birthDate.getMonth() + 1).toString(), // Convert to 1-based month
      year: birthDate.getFullYear().toString(),
    };
  }

  /**
   * Generates valid credit card information for payment testing.
   * Creates realistic card numbers, CVV codes, and future expiry dates.
   * Uses Faker's finance module for properly formatted payment data.
   * 
   * @returns Object containing card number, CVV, and expiry date components
   */
  static generateCreditCard() {
    return {
      number: faker.finance.creditCardNumber(),
      cvv: faker.finance.creditCardCVV(),
      expiryMonth: faker.date.future().getMonth() + 1, // Ensure future date
      expiryYear: faker.date.future().getFullYear()
    };
  }

  /**
   * Generates review data for product review testing scenarios.
   * Creates realistic reviewer information and review content.
   * 
   * @returns Object containing reviewer name, email, and review text
   */
  static generateReview() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      review: faker.lorem.paragraph(),
    };
  }

  /**
   * Generates random search terms for product search testing.
   * Returns common e-commerce search terms for realistic search scenarios.
   * 
   * @returns Random search term from predefined list
   */
  static generateSearchTerm(): string {
    const terms = ['shirt', 'jeans', 'dress', 'top', 'tshirt', 'men', 'women', 'kids'];
    return faker.helpers.arrayElement(terms);
  }

  /**
   * Generates random comment text for form submissions.
   * Creates multi-sentence comments using lorem ipsum text.
   * 
   * @returns Random comment text (2 sentences)
   */
  static generateComment(): string {
    return faker.lorem.sentences(2);
  }

  /**
   * Generates unique email addresses for testing scenarios.
   * Combines timestamp and random string to ensure uniqueness across test runs.
   * Useful for avoiding duplicate email conflicts in registration tests.
   * 
   * @returns Unique email address with timestamp and random components
   */
  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    const randomString = faker.string.alphanumeric(5);
    return `test.user.${timestamp}.${randomString}@example.com`;
  }

  /**
   * Generates comprehensive test data packages for specific scenarios.
   * Provides pre-configured data sets for common testing workflows.
   * 
   * @param scenario - The test scenario type ('purchase', 'registration', 'review')
   * @returns Object containing relevant data for the specified scenario
   */
  static generateTestData(scenario: string): any {
    switch (scenario) {
      case 'purchase':
        return {
          quantity: this.generateRandomQuantity(),
          user: this.generateUserData(),
          card: this.generateCreditCard(),
        };
      
      case 'registration':
        return {
          user: this.generateUserData(),
          dob: this.generateDateOfBirth(),
        };
      
      case 'review':
        return this.generateReview();
      
      default:
        return {};
    }
  }

  /**
   * Generates random boolean values for testing conditional scenarios.
   * Useful for testing feature toggles, checkboxes, or binary conditions.
   * 
   * @returns Random boolean value (true or false)
   */
  static generateBoolean(): boolean {
    return faker.datatype.boolean();
  }

  /**
   * Generates random numbers within a specified range.
   * General-purpose number generation for various testing needs.
   * 
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns Random integer within the specified range
   */
  static generateNumber(min: number, max: number): number {
    return faker.number.int({ min, max });
  }

  /**
   * Selects a random element from the provided array.
   * Generic method for random selection from any array type.
   * 
   * @param array - Array of elements to choose from
   * @returns Random element from the array
   * @template T - Type of array elements
   */
  static selectRandom<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }
}

// Convenience functions for common data generation needs

/**
 * Convenience function for generating random quantities.
 * Wrapper around DataGenerator.generateRandomQuantity for easier imports.
 * 
 * @param min - Minimum quantity (default: 1)
 * @param max - Maximum quantity (default: 20)
 * @returns Random quantity within the specified range
 */
export function randomQuantity(min: number = 1, max: number = 20): number {
  return DataGenerator.generateRandomQuantity(min, max);
}

/**
 * Convenience function for generating complete user data.
 * Wrapper around DataGenerator.generateUserData for easier imports.
 * 
 * @returns Complete user data object for registration and checkout
 */
export function randomUser() {
  return DataGenerator.generateUserData();
}

/**
 * Convenience function for generating unique email addresses.
 * Wrapper around DataGenerator.generateUniqueEmail for easier imports.
 * 
 * @returns Unique email address with timestamp and random components
 */
export function uniqueEmail(): string {
  return DataGenerator.generateUniqueEmail();
}