import { faker } from '@faker-js/faker';

export class DataGenerator {
  
  static generateRandomQuantity(min: number = 1, max: number = 20): number {
    return faker.number.int({ min, max });
  }

  static generateUserData() {
    const genre = faker.helpers.arrayElement(['male', 'female']);
    const firstName = faker.person.firstName(genre);
    const lastName = faker.person.lastName();
    const password = faker.internet.password({ length: 12 });
    const dateofBirth = this.generateDateOfBirth();
    const creditCard = this.generateCreditCard();
    
    return {
      name: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      title: genre === 'male' ? 'Mr' : 'Mrs',
      password: password,
      firstName: firstName,
      lastName: lastName,
      day: dateofBirth.day,
      month: dateofBirth.month,
      year: dateofBirth.year,
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: faker.helpers.arrayElement(['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.phone.number(),
      cardNumber: creditCard.number,
      cvv: creditCard.cvv,
      expiryMonth: creditCard.expiryMonth,
      expiryYear: creditCard.expiryYear
    };
  }

  static generateDateOfBirth() {
    const birthDate = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
    
    return {
      day: birthDate.getDate().toString(),
      month: (birthDate.getMonth() + 1).toString(),
      year: birthDate.getFullYear().toString(),
    };
  }

  static generateCreditCard() {
    return {
      number: faker.finance.creditCardNumber(),
      cvv: faker.finance.creditCardCVV(),
      expiryMonth: faker.date.future().getMonth() + 1,
      expiryYear: faker.date.future().getFullYear()
    };
  }

  static generateReview() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      review: faker.lorem.paragraph(),
    };
  }

  static generateSearchTerm(): string {
    const terms = ['shirt', 'jeans', 'dress', 'top', 'tshirt', 'men', 'women', 'kids'];
    return faker.helpers.arrayElement(terms);
  }

  static generateComment(): string {
    return faker.lorem.sentences(2);
  }

  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    const randomString = faker.string.alphanumeric(5);
    return `test.user.${timestamp}.${randomString}@example.com`;
  }

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

  static generateBoolean(): boolean {
    return faker.datatype.boolean();
  }

  static generateNumber(min: number, max: number): number {
    return faker.number.int({ min, max });
  }

  static selectRandom<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }
}

export function randomQuantity(min: number = 1, max: number = 20): number {
  return DataGenerator.generateRandomQuantity(min, max);
}

export function randomUser() {
  return DataGenerator.generateUserData();
}

export function uniqueEmail(): string {
  return DataGenerator.generateUniqueEmail();
}