# E-commerce Automation Test Suite - Playwright

## 📋 Overview

Automated testing solution for e-commerce website using Playwright with TypeScript. This project implements the Page Object Model (POM) design pattern and supports both Desktop and Mobile viewports.

**Website Under Test**: https://automationexercise.com/

## 🎯 Test Coverage

### Main Test Flow
1. ✅ Navigate to website homepage
2. ✅ Go to Products section
3. ✅ Select third product from list
4. ✅ View product details
5. ✅ Enter random quantity (1-20)
6. ✅ Add product to cart
7. ✅ View cart and verify quantity
8. ✅ Proceed to checkout
9. ✅ Verify Register/Login modal appears

### Supported Viewports
- **Desktop**: 1920x1080 (Chrome, Firefox, Safari/WebKit)
- **Mobile**: iPhone 13 Pro, Pixel 5

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone repository
git clone <repository-url>
cd playwright-ecommerce-test

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
npx playwright install-deps
```

### Running Tests

```bash
# Run all tests (headless mode)
npm test

# Run with browser visible
npm run test:headed

# Run with Playwright UI mode (recommended for debugging)
npm run test:ui

# Run only desktop tests
npm run test:desktop

# Run only mobile tests
npm run test:mobile

# Run specific browser
npm run test:chrome

# Debug mode
npm run test:debug
```

### View Test Reports

```bash
# Open HTML report
npm run report

# Open report on specific host/port
npm run report:open
```

## 📁 Project Structure

```
playwright-ecommerce-test/
├── pages/                      # Page Object Models
│   ├── BasePage.ts            # Base class with common methods
│   ├── HomePage.ts            # Home page object
│   ├── ProductsPage.ts        # Products listing page
│   ├── ProductDetailPage.ts   # Product detail page
│   └── CartPage.ts            # Shopping cart page
├── tests/
│   └── e2e/
│       └── purchase-flow.spec.ts  # Main test suite
├── utils/
│   └── data-generator.ts      # Random data generation using Faker
├── test-results/              # Test execution results
├── playwright-report/         # HTML test reports
├── screenshots/               # Test screenshots
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies
└── README.md                 # This file
```

## 🏗️ Architecture

### Page Object Model (POM)

Each page is represented as a class with:
- **Locators**: Element selectors defined as class properties
- **Methods**: Actions that can be performed on the page
- **Reusability**: Common functionality inherited from BasePage

Example:
```typescript
export class ProductsPage extends BasePage {
  private readonly productItems: Locator;
  
  async viewThirdProduct(): Promise<void> {
    await this.viewProductByIndex(2);
  }
}
```

### Data Management

Uses Faker library for generating realistic test data:
```typescript
const quantity = DataGenerator.generateRandomQuantity(1, 20);
const userData = DataGenerator.generateUserData();
```

## 🧪 Test Execution Example

```bash
$ npm test

Running 3 tests using 3 workers

  ✓ Complete purchase flow - Add product to cart and proceed to checkout (desktop-chromium) (15s)
  ✓ Complete purchase flow - Add product to cart and proceed to checkout (mobile-chrome) (12s)
  ✓ Verify product details are displayed correctly (desktop-chromium) (8s)

  3 passed (35s)

To open last HTML report run:
  npx playwright show-report
```

## 📊 Test Reporting

The project generates multiple report formats:

1. **HTML Report** - Interactive browser-based report
   - Screenshots on failure
   - Video recordings
   - Trace files for debugging
   
2. **JSON Report** - Machine-readable format for CI/CD
   
3. **JUnit XML** - Compatible with most CI systems

## 🔧 Configuration

### Playwright Config Highlights

```typescript
{
  timeout: 60000,              // 60 seconds per test
  retries: 2,                  // Retry failed tests (CI only)
  workers: 1,                  // Parallel execution workers
  trace: 'on-first-retry',     // Trace on failure
  screenshot: 'only-on-failure', // Screenshot on failure
  video: 'retain-on-failure'   // Video on failure
}
```

### Viewport Configuration

```typescript
{
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 390, height: 844 }
}
```

## 📝 Test Case Document

See [Test Case Document](./TEST_CASE.md) for detailed test steps, preconditions, and expected results.

## 🐛 Troubleshooting

### Common Issues

**Issue**: Tests fail with timeout
```bash
# Solution: Increase timeout in playwright.config.ts
timeout: 120 * 1000  // 2 minutes
```

**Issue**: Browser not installed
```bash
# Solution: Reinstall Playwright browsers
npx playwright install --with-deps
```

**Issue**: Element not found
```bash
# Solution: Run in UI mode to debug
npm run test:ui
```

### Debug Mode

```bash
# Run with Playwright Inspector
npm run test:debug

# Run specific test file
npx playwright test tests/e2e/purchase-flow.spec.ts --debug
```

## 📈 CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 🎓 Best Practices Implemented

✅ **Page Object Model** - Maintainable and reusable code  
✅ **TypeScript** - Type safety and better IDE support  
✅ **Faker Integration** - Realistic random data generation  
✅ **Responsive Testing** - Desktop and Mobile viewports  
✅ **Comprehensive Logging** - Console output for debugging  
✅ **Error Handling** - Graceful failure handling  
✅ **Screenshot Evidence** - Automatic capture on failures  
✅ **Modular Design** - Easy to extend and maintain  

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Faker.js Documentation](https://fakerjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 👤 Author

**QA Engineer - Apply Digital**

## 📄 License

MIT License - Feel free to use and modify

## ⏱️ Time Estimate

- **Setup**: 10 minutes
- **Test Execution**: 1-2 minutes per viewport
- **Total Development**: ~2 hours (as per requirements)

## 🔄 Test Execution Report

After running tests, you'll find:
- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`
- **Screenshots**: `test-results/*.png`

## 🎯 Success Criteria

- ✅ All tests pass on Desktop and Mobile viewports
- ✅ Product added to cart with correct quantity
- ✅ Register/Login modal appears at checkout
- ✅ Test execution completes in < 2 minutes
- ✅ Clear test reporting with screenshots

---

**Note**: This project was developed as part of the Apply Digital QA Engineer Skill Test.