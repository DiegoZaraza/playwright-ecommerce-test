import { test, expect } from "@playwright/test";
import { HomePage } from "@pages/HomePage";
import { ProductsPage } from "../../pages/ProductsPage";
import { ProductDetailPage } from "../../pages/ProductDetailPage";
import { CartPage } from "../../pages/CartPage";
import { LoginPage } from "../../pages/LoginPage";
import { AccountCreatedPage } from "../../pages/AccountCreated";
import { CheckoutPage } from "../../pages/CheckoutPage";
import { SignUpPage } from "../../pages/SignUpPage";
import { PaymentPage } from "../../pages/PaymentPage";
import { DataGenerator } from "../../utils/data-generator";

test.describe("E-commerce Purchase Flow", () => {
  let randomQuantity: number;

  test.beforeEach(async () => {
    // Generate a random quantity for each test run to improve coverage and simulate different user behaviors.
    randomQuantity = DataGenerator.generateRandomQuantity(1, 20);
    console.log(`Test will use quantity: ${randomQuantity}`);
  });

  test("Complete purchase flow - Add product to cart and proceed to checkout", async ({
    page,
  }) => {
    console.log('🚀 Starting complete purchase flow test...');
    
    const homePage = new HomePage(page);
    
    console.log('📍 Step 1: Navigating to homepage...');
    await homePage.navigate();

    const isHomePageLoaded = await homePage.isLoaded();
    expect(isHomePageLoaded, "Home page should load successfully").toBeTruthy();
    console.log('✅ Step 1: Homepage loaded successfully');

    console.log('📍 Step 2: Navigating to products page...');
    await homePage.navigateToProducts();

    const productsPage = new ProductsPage(page);
    await productsPage.waitForProductsPage();

    const hasCorrectTitle = await productsPage.hasCorrectTitle();
    expect(hasCorrectTitle, "Products page should display correct title").toBeTruthy();

    const productCount = await productsPage.getProductCount();
    expect(productCount, "Products should be displayed").toBeGreaterThan(0);

    const thirdProductName = await productsPage.getProductName(2);
    expect(thirdProductName, "Third product name should be defined").toBeTruthy();
    console.log(`✅ Step 2: Products page loaded with ${productCount} products. Selected: ${thirdProductName}`);

    console.log('📍 Step 3: Viewing product details...');
    await productsPage.viewThirdProduct();

    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.waitForProductDetailPage();

    const detailProductName = await productDetailPage.getProductName();
    expect(detailProductName, "Product detail page should display").toBeTruthy();
    console.log(`✅ Step 3: Product details loaded for: ${detailProductName}`);

    console.log('📍 Step 4: Setting quantity and adding to cart...');
    await productDetailPage.setQuantity(randomQuantity);

    const currentQuantity = await productDetailPage.getCurrentQuantity();
    expect(parseInt(currentQuantity), "Quantity should be set correctly").toBe(randomQuantity);

    await productDetailPage.addToCart();

    const isModalVisible = await productDetailPage.isSuccessModalVisible();
    expect(isModalVisible, "Success modal should appear after adding to cart").toBeTruthy();
    console.log(`✅ Step 4: Product added to cart with quantity: ${randomQuantity}`);

    await productDetailPage.clickViewCart();

    const cartPage = new CartPage(page);
    await cartPage.waitForCartPage();

    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount, "Cart should contain items").toBeGreaterThan(0);

    const cartQuantity = await cartPage.getItemQuantity(0);
    expect(cartQuantity, "Cart quantity should match selected quantity").toBe(
      randomQuantity
    );

    await cartPage.proceedToCheckout();

    const isRegisterLoginVisible = await cartPage.isRegisterLoginModalVisible();
    expect(
      isRegisterLoginVisible,
      "Register/Login modal or page should appear"
    ).toBeTruthy();

    const viewport = page.viewportSize() || { width: 800, height: 600 };
    await page.screenshot({
      path: `test-results/checkout-modal-${viewport.width}x${viewport.height}.png`,
      fullPage: true,
    });

    await cartPage.clickRegisterLogin();

    const loginPage = new LoginPage(page);
    await loginPage.waitForLoginPage();

    const isLoginPageLoaded = await loginPage.getTitleSignUp();
    expect(isLoginPageLoaded, "New User Signup!").toBeTruthy();

    const userData = DataGenerator.generateUserData();

    await loginPage.fillSignupForm(userData.name, userData.email);

    const signUpPage = new SignUpPage(page);
    await signUpPage.waitForSignUpPage();
    const isSignUpPageLoaded = await signUpPage.getTitleSignUpPage();
    expect(isSignUpPageLoaded).toContain("Enter Account Information");

    const isNameAndEmailPrefilled = await signUpPage.validateNameAndEmail(userData.name, userData.email);
    expect(isNameAndEmailPrefilled, "Name and Email should be pre-filled").toBeTruthy();

    await signUpPage.fillSignupForm(userData);

    const accountCreatedPage = new AccountCreatedPage(page);
    await accountCreatedPage.waitForAccountCreatedPage();

    const isAccountCreated = await accountCreatedPage.getAccountCreatedTitle();
    expect(isAccountCreated).toContain("Account Created!");

    await accountCreatedPage.clickContinue();

    await homePage.navigateToCart();

    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.clickPlaceOrderButton();

    const paymentPage = new PaymentPage(page);

    await paymentPage.fillPaymentForm(
      userData.name,
      userData.cardNumber,
      userData.cvv,
      userData.expiryMonth.toString(),
      userData.expiryYear.toString()
    );

    const isPaymentSuccessful = await paymentPage.getSuccessfulMessage();
    expect(isPaymentSuccessful).toContain("Order Placed!");
  });
});