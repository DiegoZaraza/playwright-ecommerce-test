# 🛒 E-commerce Automation Test Suite - Playwright

[![Playwright Tests](https://img.shields.io/badge/Playwright-Tests-green)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Overview

Comprehensive automated testing solution for e-commerce workflows using **Playwright** with **TypeScript**. This test suite implements industry best practices including the **Page Object Model (POM)** design pattern, cross-browser compatibility testing, and responsive design validation across desktop and mobile viewports.

🎯 **Key Features:**
- ✨ Cross-browser testing (Chrome, Firefox, Safari/WebKit)
- 📱 Responsive design validation (Desktop & Mobile)
- 🔄 Automated retry mechanisms and error handling
- 📊 Rich HTML reporting with screenshots and video recordings
- 🎲 Dynamic test data generation using Faker.js
- 🏗️ Scalable Page Object Model architecture

**🌐 Website Under Test**: [https://automationexercise.com/](https://automationexercise.com/)

## 🎯 Test Coverage & Scenarios

### 🛍️ Complete Purchase Flow (End-to-End)
The main test suite covers the entire customer journey from product discovery to checkout:

| Step | Action | Verification |
|------|--------|-------------|
| 1️⃣ | **Homepage Navigation** | Verify site loads and logo is visible |
| 2️⃣ | **Product Discovery** | Navigate to products section and validate page |
| 3️⃣ | **Product Selection** | Select third product from the product list |
| 4️⃣ | **Product Details** | View detailed product information and pricing |
| 5️⃣ | **Quantity Selection** | Set random quantity (1-20 items) |
| 6️⃣ | **Add to Cart** | Add product to shopping cart with confirmation |
| 7️⃣ | **Cart Verification** | Verify correct product and quantity in cart |
| 8️⃣ | **Checkout Process** | Initiate checkout workflow |
| 9️⃣ | **Authentication** | Verify Register/Login modal appears |
| 🔟 | **User Registration** | Complete new user registration process |
| 1️⃣1️⃣ | **Payment Completion** | Process payment and verify success |

### 🖥️ Supported Browser & Device Matrix

| Browser | Desktop (1920x1080) | Mobile (390x844) | Status |
|---------|-------------------|------------------|--------|
| **Chrome** | ✅ Supported | ✅ Supported | Primary |
| **Firefox** | ✅ Supported | ✅ Supported | Secondary |
| **Safari/WebKit** | ✅ Supported | ✅ Supported | Cross-platform |

### 📱 Device Simulation
- **📱 Mobile Devices**: iPhone 13 Pro, Pixel 5, Samsung Galaxy
- **🖥️ Desktop Resolutions**: Full HD (1920x1080), 4K support

## 🚀 Quick Start Guide

### 📋 Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | >= 18.0.0 | JavaScript runtime for test execution |
| **npm** | >= 9.0.0 | Package manager for dependencies |
| **Git** | Latest | Version control and repository cloning |

### ⚡ Installation Steps

```bash
# 1️⃣ Clone the repository
git clone <repository-url>
cd playwright-ecommerce-test

# 2️⃣ Install project dependencies
npm install

# 3️⃣ Install Playwright browsers and system dependencies
npx playwright install
npx playwright install-deps

# 4️⃣ Verify installation (optional)
npx playwright --version
```

### 🏃‍♂️ Running Tests

#### 🎯 Basic Execution Commands

```bash
# 🏃 Run all tests (headless mode - fastest)
npm test

# 👀 Run with browser visible (great for watching tests)
npm run test:headed

# 🔍 Run with Playwright UI mode (recommended for debugging)
npm run test:ui

# 🐛 Debug mode with step-by-step execution
npm run test:debug
```

#### 📱 Platform-Specific Testing

```bash
# 🖥️ Desktop-only test execution
npm run test:desktop

# 📱 Mobile-only test execution  
npm run test:mobile

# 🌐 Browser-specific testing
npm run test:chrome    # Chrome browser only
npm run test:firefox   # Firefox browser only
npm run test:webkit    # Safari/WebKit only
```

### 📊 Test Reports & Results

```bash
# 📋 Open interactive HTML report
npm run report

# 🌐 Open report on custom host/port
npm run report:open

# 📁 View test results directory
ls -la test-results/

# 🎬 View recorded videos (on failure)
ls -la test-results/**/*.webm
```

## 📁 Project Architecture & Structure

### 🏗️ Directory Layout

```
playwright-ecommerce-test/
├── 📂 pages/                           # 🎭 Page Object Models (POM)
│   ├── 🏠 HomePage.ts                  # Landing page interactions
│   ├── 🛍️ ProductsPage.ts             # Product listing & search
│   ├── 📋 ProductDetailPage.ts        # Individual product details
│   ├── 🛒 CartPage.ts                 # Shopping cart operations
│   ├── 👤 LoginPage.ts                # User authentication
│   ├── 📝 SignUpPage.ts               # User registration
│   ├── 💳 CheckoutPage.ts             # Order placement
│   ├── 💰 PaymentPage.ts              # Payment processing  
│   ├── ✅ AccountCreated.ts           # Registration confirmation
│   └── 🔧 BasePage.ts                 # Shared functionality base class
├── 📂 tests/                          # 🧪 Test Specifications
│   └── 📂 e2e/                        # End-to-end test scenarios
│       └── 🛒 purchase-flow.spec.ts   # Complete purchase workflow
├── 📂 utils/                          # 🔧 Utility Functions
│   └── 🎲 data-generator.ts           # Faker.js data generation
├── 📂 test-results/                   # 📊 Test Execution Outputs
│   ├── 📋 results.json               # Machine-readable results
│   ├── 📊 junit.xml                  # JUnit format for CI/CD
│   └── 📷 screenshots/               # Failure screenshots
├── 📂 playwright-report/              # 📈 Interactive HTML Reports
│   ├── 📄 index.html                 # Main report dashboard
│   └── 📂 data/                      # Report assets & traces
├── ⚙️ playwright.config.ts            # Framework configuration
├── 📝 tsconfig.json                   # TypeScript settings
├── 📦 package.json                    # Dependencies & scripts
└── 📖 README.md                       # This documentation
```

## 🏗️ Technical Architecture & Design Patterns

### 🎭 Page Object Model (POM) Implementation

Our POM architecture provides maintainable, reusable, and scalable test code:

#### 🔧 Core Components

| Component | Purpose | Example |
|-----------|---------|---------|
| **🏠 Page Classes** | Encapsulate page-specific logic | `HomePage`, `CartPage` |
| **🎯 Locators** | Element selectors as class properties | `private readonly loginButton` |
| **⚡ Actions** | User interaction methods | `async clickLogin()` |
| **✅ Assertions** | Page state verification | `async isLoggedIn()` |


## 👤 Project Information

**👨‍💻 Author**: Diego Zaraza
