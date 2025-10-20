// Import Playwright test framework and expect assertion library
import { test, expect } from "@playwright/test";

// Import page object models for different pages in the e-commerce application
import { HomePage } from "@pages/HomePage";
import { ProductsPage } from "../../pages/ProductsPage";
import { ProductDetailPage } from "../../pages/ProductDetailPage";
import { CartPage } from "../../pages/CartPage";
import { LoginPage } from "../../pages/LoginPage";
import { AccountCreatedPage } from "../../pages/AccountCreated";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { SignUpPage } from "../../pages/SignUpPage";
import { PaymentPage } from "../../pages/PaymentPage";

// Import utility class for generating test data
import { DataGenerator } from "../../utils/data-generator";

/**
 * Test suite for end-to-end e-commerce purchase flow
 * Tests the complete user journey from browsing products to completing payment
 */
test.describe("E-commerce Purchase Flow", () => {
  // Variable to store randomly generated quantity for each test run
  let randomQuantity: number;

  /**
   * Setup hook that runs before each test
   * Generates random test data to simulate realistic user behavior
   */
  test.beforeEach(async () => {
    // Generate a random quantity (1-20) for each test run to improve test coverage
    // and simulate different user behaviors across test runs
    randomQuantity = DataGenerator.generateRandomQuantity(1, 20);
    console.log(`Test will use quantity: ${randomQuantity}`);
  });

  /**
   * Main test case that covers the complete e-commerce purchase flow:
   * 1. Navigate to homepage
   * 2. Browse and select a product
   * 3. Add product to cart with specified quantity
   * 4. Proceed to checkout
   * 5. Register new user account
   * 6. Complete payment process
   */
  test("Complete purchase flow - Add product to cart and proceed to checkout", async ({
    page,
  }) => {
    console.log('Starting complete purchase flow test...');
    
    // Initialize page object for homepage interactions
    const homePage = new HomePage(page);
    
    console.log('Step 1: Navigating to homepage...');
    await homePage.navigate();

    const isHomePageLoaded = await homePage.isLoaded();
    expect(isHomePageLoaded, "Home page should load successfully").toBeTruthy();
    console.log('Step 2: Homepage loaded successfully');

    console.log('Step 3: Navigating to products page...');
    await homePage.navigateToProducts();

    // Initialize page object for products page interactions
    const productsPage = new ProductsPage(page);
    await productsPage.waitForProductsPage();

    // Verify the products page loads with correct title
    const hasCorrectTitle = await productsPage.hasCorrectTitle();
    expect(hasCorrectTitle, "Products page should display correct title").toBeTruthy();

    // Verify that products are displayed on the page
    const productCount = await productsPage.getProductCount();
    expect(productCount, "Products should be displayed").toBeGreaterThan(0);

    // Get the name of the third product (index 2) for selection
    const thirdProductName = await productsPage.getProductName(2);
    expect(thirdProductName, "Third product name should be defined").toBeTruthy();
    console.log(`Step 4: Products page loaded with ${productCount} products. Selected: ${thirdProductName}`);

    console.log('Step 5: Viewing product details...');
    await productsPage.viewThirdProduct();

    // Initialize page object for product detail page interactions
    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.waitForProductDetailPage();

    // Verify product details are displayed correctly
    const detailProductName = await productDetailPage.getProductName();
    expect(detailProductName, "Product detail page should display").toBeTruthy();
    console.log(`Step 6: Product details loaded for: ${detailProductName}`);

    console.log('Step 7: Setting quantity and adding to cart...');
    
    // Set the desired quantity (using randomly generated value)
    await productDetailPage.setQuantity(randomQuantity);

    // Verify the quantity was set correctly
    const currentQuantity = await productDetailPage.getCurrentQuantity();
    expect(parseInt(currentQuantity), "Quantity should be set correctly").toBe(randomQuantity);

    // Add the product to cart
    await productDetailPage.addToCart();

    // Verify success modal appears to confirm product was added
    const isModalVisible = await productDetailPage.isSuccessModalVisible();
    expect(isModalVisible, "Success modal should appear after adding to cart").toBeTruthy();
    console.log(`Step 8: Product added to cart with quantity: ${randomQuantity}`);

    await productDetailPage.clickViewCart();

    // Initialize page object for shopping cart interactions
    const cartPage = new CartPage(page);
    await cartPage.waitForCartPage();

    // Verify cart contains the added items
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount, "Cart should contain items").toBeGreaterThan(0);

    // Verify the quantity in cart matches what was selected
    const cartQuantity = await cartPage.getItemQuantity(0);
    expect(cartQuantity, "Cart quantity should match selected quantity").toBe(
      randomQuantity
    );
    console.log(`Step 9: Cart verified with ${cartItemCount} item(s) and quantity: ${cartQuantity}`);

    await cartPage.proceedToCheckout();

    // Verify that login/registration modal or page appears
    const isRegisterLoginVisible = await cartPage.isRegisterLoginModalVisible();
    expect(
      isRegisterLoginVisible,
      "Register/Login modal or page should appear"
    ).toBeTruthy();

    // Take screenshot for documentation/debugging purposes
    const viewport = page.viewportSize() || { width: 800, height: 600 };
    await page.screenshot({
      path: `test-results/checkout-modal-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });

    // Click to proceed with registration/login
    await cartPage.clickRegisterLogin();
    console.log('Step 10: Proceeded to checkout and authentication screen');

    // Initialize page object for login/registration page
    const loginPage = new LoginPage(page);
    await loginPage.waitForLoginPage();

    // Verify login page loads with signup option
    const isLoginPageLoaded = await loginPage.getTitleSignUp();
    expect(isLoginPageLoaded, "New User Signup!").toBeTruthy();

    // Generate realistic user data for registration
    const userData = DataGenerator.generateUserData();

    // Fill initial signup form with name and email
    await loginPage.fillSignupForm(userData.name, userData.email);
    console.log(`Step 11: Initial signup form filled for user: ${userData.name}`);

    // Initialize page object for detailed signup form
    const signUpPage = new SignUpPage(page);
    await signUpPage.waitForSignUpPage();
    
    // Verify detailed signup page loads correctly
    const isSignUpPageLoaded = await signUpPage.getTitleSignUpPage();
    expect(isSignUpPageLoaded).toContain("Enter Account Information");

    // Verify that name and email are pre-filled from previous step
    const isNameAndEmailPrefilled = await signUpPage.validateNameAndEmail(userData.name, userData.email);
    expect(isNameAndEmailPrefilled, "Name and Email should be pre-filled").toBeTruthy();

    // Fill complete signup form with all required user information
    await signUpPage.fillSignupForm(userData);
    console.log('Step 12: Complete signup form filled with user details');

    // Initialize page object for account creation confirmation
    const accountCreatedPage = new AccountCreatedPage(page);
    await accountCreatedPage.waitForAccountCreatedPage();

    // Verify account was created successfully
    const isAccountCreated = await accountCreatedPage.getAccountCreatedTitle();
    expect(isAccountCreated).toContain("Account Created!");

    // Continue to proceed with the user logged in
    await accountCreatedPage.clickContinue();
    console.log('Step 9: Account created successfully and user is now logged in');

    await homePage.navigateToCart();
    await cartPage.proceedToCheckout();

    // Initialize page object for checkout process
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.clickPlaceOrderButton();
    console.log('Step 13: Proceeded to place order');

    // Initialize page object for payment processing
    const paymentPage = new PaymentPage(page);

    // Fill payment form with generated credit card information
    await paymentPage.fillPaymentForm(
      userData.name,
      userData.cardNumber,
      userData.cvv,
      userData.expiryMonth.toString(),
      userData.expiryYear.toString()
    );

    // Verify payment was processed successfully
    const isPaymentSuccessful = await paymentPage.getSuccessfulMessage();
    expect(isPaymentSuccessful).toContain("Order Placed!");
    console.log('Step 14: Payment completed successfully - Order placed!');
    console.log('Complete purchase flow test completed successfully!');
  });
});