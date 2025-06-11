# FanForge Test Plan

## Overview

This comprehensive test plan covers all aspects of FanForge testing, from unit tests to end-to-end user acceptance testing. The plan aligns with the PRD requirements, wireflow specifications, and technical architecture to ensure a robust 30-day launch.

## Testing Strategy

### Testing Pyramid

1. **Unit Tests (70%)** - Component logic, utilities, validation schemas
2. **Integration Tests (20%)** - API interactions, form submissions, state management
3. **End-to-End Tests (10%)** - Complete user workflows, cross-browser compatibility

### Testing Framework Alignment

- **Unit Testing:** Jest + React Testing Library
- **Integration Testing:** Jest + MSW (Mock Service Worker)
- **E2E Testing:** Playwright
- **Visual Testing:** Storybook + Chromatic
- **Accessibility Testing:** jest-axe + manual testing

## Unit Testing

### Component Testing

#### Authentication Components

```typescript
// tests/components/auth/login-form.test.tsx
describe("LoginForm", () => {
  it("validates email format", () => {
    // Test email validation with invalid formats
  })

  it("validates password length", () => {
    // Test password minimum length requirement
  })

  it("submits form with valid data", () => {
    // Test successful form submission
  })

  it("displays error messages", () => {
    // Test error state display
  })
})
```

#### UI Components

```typescript
// tests/components/ui/button.test.tsx
describe("Button", () => {
  it("renders with correct variant styles", () => {
    // Test all button variants (primary, secondary, outline, ghost, destructive)
  })

  it("handles loading state", () => {
    // Test loading spinner and disabled state
  })

  it("supports different sizes", () => {
    // Test sm, md, lg sizes
  })
})
```

#### Canvas Components

```typescript
// tests/components/canvas/creation-canvas.test.tsx
describe("CreationCanvas", () => {
  it("handles asset drag and drop", () => {
    // Test drag and drop functionality
  })

  it("manages element selection", () => {
    // Test element selection and deselection
  })

  it("updates element properties", () => {
    // Test width, height, rotation updates
  })
})
```

### Utility Function Testing

#### Validation Schemas

```typescript
// tests/lib/validations.test.ts
describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("accepts valid email and password", () => {
      // Test valid inputs
    })

    it("rejects invalid email formats", () => {
      // Test various invalid email formats
    })

    it("rejects short passwords", () => {
      // Test password length validation
    })
  })

  describe("campaignSchema", () => {
    it("validates campaign creation data", () => {
      // Test campaign form validation
    })
  })
})
```

#### Utility Functions

```typescript
// tests/lib/utils.test.ts
describe("Utility Functions", () => {
  describe("formatDate", () => {
    it("formats dates correctly", () => {
      // Test date formatting
    })
  })

  describe("generateId", () => {
    it("generates unique IDs", () => {
      // Test ID generation uniqueness
    })
  })
})
```

## Integration Testing

### API Integration Tests

#### Authentication Flow

```typescript
// tests/integration/auth.test.ts
describe("Authentication Integration", () => {
  it("registers new user successfully", async () => {
    // Test complete registration flow
    // Mock API response
    // Verify user state update
  })

  it("logs in existing user", async () => {
    // Test login flow
    // Verify token storage
    // Verify redirect behavior
  })

  it("handles authentication errors", async () => {
    // Test error scenarios
    // Verify error message display
  })
})
```

#### Campaign Management

```typescript
// tests/integration/campaigns.test.ts
describe("Campaign Management Integration", () => {
  it("creates campaign with assets", async () => {
    // Test campaign creation flow
    // Mock file upload
    // Verify campaign data persistence
  })

  it("fetches campaign list with filters", async () => {
    // Test campaign discovery
    // Verify filtering functionality
    // Test pagination
  })
})
```

#### Submission Workflow

```typescript
// tests/integration/submissions.test.ts
describe("Submission Workflow Integration", () => {
  it("submits artwork for review", async () => {
    // Test submission creation
    // Mock canvas data
    // Verify submission status
  })

  it("reviews and approves submission", async () => {
    // Test review workflow
    // Verify status updates
    // Test notification system
  })
})
```

### Form Integration Tests

#### Campaign Creation Form

```typescript
// tests/integration/forms/campaign-form.test.ts
describe("Campaign Form Integration", () => {
  it("handles multi-step form submission", async () => {
    // Test form wizard navigation
    // Verify data persistence between steps
    // Test final submission
  })

  it("validates file uploads", async () => {
    // Test asset upload validation
    // Verify file type restrictions
    // Test file size limits
  })
})
```

## End-to-End Testing

### User Journey Tests

#### Creator Journey: Discovery to Submission

```typescript
// tests/e2e/creator-journey.spec.ts
describe("Creator Journey", () => {
  test("complete creator workflow", async ({page}) => {
    // 1. Landing page visit
    await page.goto("/")

    // 2. Registration
    await page.click("text=Get Started")
    await page.fill("[data-testid=email]", "maya@example.com")
    await page.fill("[data-testid=password]", "password123")
    await page.selectOption("[data-testid=role]", "creator")
    await page.click("text=Create Account")

    // 3. Campaign discovery
    await expect(page).toHaveURL("/discover")
    await page.fill("[data-testid=search]", "anime")
    await page.click("[data-testid=campaign-card]:first-child")

    // 4. Campaign details
    await expect(page).toHaveURL(/\/campaigns\/\w+/)
    await page.click("text=Join Campaign")

    // 5. Creation canvas
    await expect(page).toHaveURL(/\/create\/\w+/)
    // Test drag and drop
    await page.dragAndDrop("[data-testid=asset-1]", "[data-testid=canvas]")

    // 6. Submission
    await page.click("text=Submit Artwork")
    await page.fill("[data-testid=title]", "My Amazing Creation")
    await page.fill("[data-testid=description]", "Created with official assets")
    await page.click("text=Submit for Review")

    // 7. Portfolio verification
    await expect(page).toHaveURL("/portfolio")
    await expect(page.locator("text=My Amazing Creation")).toBeVisible()
  })
})
```

#### Brand Admin Journey: Campaign Creation to Review

```typescript
// tests/e2e/brand-admin-journey.spec.ts
describe("Brand Admin Journey", () => {
  test("complete brand admin workflow", async ({page}) => {
    // 1. Login as brand admin
    await page.goto("/login")
    await page.fill("[data-testid=email]", "david@example.com")
    await page.fill("[data-testid=password]", "password123")
    await page.click("text=Sign In")

    // 2. Dashboard access
    await expect(page).toHaveURL("/dashboard")

    // 3. Campaign creation
    await page.click("text=Create Campaign")
    await page.fill("[data-testid=title]", "New Brand Campaign")
    await page.fill("[data-testid=description]", "Campaign description")

    // 4. Asset upload
    await page.setInputFiles(
      "[data-testid=asset-upload]",
      "test-assets/character.png"
    )
    await page.selectOption("[data-testid=asset-category]", "characters")

    // 5. Campaign publishing
    await page.click("text=Publish Campaign")

    // 6. Submission review
    await page.goto("/submissions")
    await page.click("[data-testid=submission-card]:first-child")
    await page.click("text=Approve")
    await page.fill("[data-testid=feedback]", "Great work!")
    await page.click("text=Confirm Approval")
  })
})
```

### Cross-Browser Testing

```typescript
// tests/e2e/cross-browser.spec.ts
describe("Cross-Browser Compatibility", () => {
  ;["chromium", "firefox", "webkit"].forEach(browserName => {
    test(`works in ${browserName}`, async ({browser}) => {
      const context = await browser.newContext()
      const page = await context.newPage()

      // Test core functionality across browsers
      await page.goto("/")
      await expect(page.locator("h1")).toContainText(
        "Create with Official Brand Assets"
      )
    })
  })
})
```

## Accessibility Testing

### Automated Accessibility Tests

```typescript
// tests/accessibility/a11y.test.ts
import {axe, toHaveNoViolations} from "jest-axe"

expect.extend(toHaveNoViolations)

describe("Accessibility Tests", () => {
  it("landing page has no accessibility violations", async () => {
    const {container} = render(<HomePage />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("login form is accessible", async () => {
    const {container} = render(<LoginForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("creation canvas is accessible", async () => {
    const {container} = render(<CreationCanvas assets={mockAssets} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Manual Accessibility Testing Checklist

- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader compatibility (NVDA, JAWS, VoiceOver)
- [ ] Focus indicators are visible and clear
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Alt text provided for all images
- [ ] Form labels properly associated with inputs
- [ ] ARIA landmarks and roles implemented
- [ ] Skip links available for keyboard users

## Performance Testing

### Core Web Vitals Testing

```typescript
// tests/performance/web-vitals.test.ts
describe("Performance Tests", () => {
  test("First Contentful Paint < 1.5s", async ({page}) => {
    await page.goto("/")
    const fcp = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries()
          const fcpEntry = entries.find(
            entry => entry.name === "first-contentful-paint"
          )
          if (fcpEntry) resolve(fcpEntry.startTime)
        }).observe({entryTypes: ["paint"]})
      })
    })
    expect(fcp).toBeLessThan(1500)
  })

  test("Largest Contentful Paint < 2.5s", async ({page}) => {
    // Test LCP performance
  })

  test("Cumulative Layout Shift < 0.1", async ({page}) => {
    // Test CLS performance
  })
})
```

### Load Testing

```typescript
// tests/performance/load.test.ts
describe("Load Testing", () => {
  test("handles multiple concurrent users", async () => {
    // Simulate multiple users accessing the platform
    // Test API response times under load
    // Verify UI responsiveness
  })
})
```

## Visual Regression Testing

### Storybook Visual Tests

```typescript
// .storybook/test-runner.ts
import {injectAxe, checkA11y} from "axe-playwright"

export default {
  async preRender(page) {
    await injectAxe(page)
  },
  async postRender(page) {
    await checkA11y(page, "#root", {
      detailedReport: true,
      detailedReportOptions: {html: true},
    })
  },
}
```

### Component Visual Tests

```typescript
// tests/visual/components.test.ts
describe("Visual Regression Tests", () => {
  test("button variants render correctly", async ({page}) => {
    await page.goto("/storybook/?path=/story/button--all-variants")
    await expect(page).toHaveScreenshot("button-variants.png")
  })

  test("campaign cards display properly", async ({page}) => {
    await page.goto("/storybook/?path=/story/campaign-card--default")
    await expect(page).toHaveScreenshot("campaign-card.png")
  })
})
```

## Test Data Management

### Mock Data Setup

```typescript
// tests/setup/mock-data.ts
export const testUsers = {
  creator: {
    id: "test-creator-1",
    email: "test-creator@example.com",
    role: "creator",
    name: "Test Creator",
  },
  brandAdmin: {
    id: "test-brand-1",
    email: "test-brand@example.com",
    role: "brand_admin",
    name: "Test Brand Admin",
  },
}

export const testCampaigns = [
  {
    id: "test-campaign-1",
    title: "Test Campaign",
    description: "Test campaign description",
    status: "active",
    deadline: new Date("2025-12-31"),
  },
]
```

### Test Environment Setup

```typescript
// tests/setup/test-env.ts
import {setupServer} from "msw/node"
import {handlers} from "./handlers"

export const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Acceptance Testing Matrix

### Feature Acceptance Criteria

| Feature              | Test Scenarios                  | Acceptance Criteria                                         | Status |
| -------------------- | ------------------------------- | ----------------------------------------------------------- | ------ |
| User Authentication  | Registration, Login, Logout     | Users can create accounts and access role-specific features | ⏳     |
| Campaign Discovery   | Search, Filter, Browse          | Creators can find relevant campaigns easily                 | ⏳     |
| Campaign Creation    | Form submission, Asset upload   | Brand admins can create comprehensive campaigns             | ⏳     |
| Creation Canvas      | Drag-drop, Element manipulation | Creators can compose artworks intuitively                   | ⏳     |
| Submission Review    | Approve/Reject workflow         | Brand admins can review submissions efficiently             | ⏳     |
| Portfolio Management | Display approved works          | Creators can showcase their approved artworks               | ⏳     |
| Responsive Design    | Mobile, Tablet, Desktop         | Platform works across all device sizes                      | ⏳     |
| Dark Mode            | Theme switching                 | Users can toggle between light and dark themes              | ⏳     |

### Browser Compatibility Matrix

| Browser | Version | Desktop | Mobile | Status |
| ------- | ------- | ------- | ------ | ------ |
| Chrome  | 90+     | ✅      | ✅     | ⏳     |
| Firefox | 88+     | ✅      | ✅     | ⏳     |
| Safari  | 14+     | ✅      | ✅     | ⏳     |
| Edge    | 90+     | ✅      | ✅     | ⏳     |

## Test Automation Pipeline

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm install
      - run: npm run test:unit

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npx playwright install
      - run: npm run test:e2e
```

## Testing Framework Validation

All testing approaches align with technical requirements:

- **Framework:** React 18 + Next.js 14 App Router ✓
- **Testing Library:** Jest + React Testing Library ✓
- **E2E Testing:** Playwright ✓
- **Mock APIs:** MSW (Mock Service Worker) ✓
- **Accessibility:** jest-axe ✓
- **Commands:** `npm run test`, `npm run test:e2e` ✓

## Success Metrics

### Test Coverage Targets

- **Unit Tests:** 80% code coverage minimum
- **Integration Tests:** 100% critical path coverage
- **E2E Tests:** 100% user journey coverage
- **Accessibility:** Zero WCAG 2.1 AA violations

### Quality Gates

- All tests must pass before deployment
- Performance budgets must be met
- Accessibility standards must be maintained
- Cross-browser compatibility verified

## Launch Readiness Checklist

- [ ] All unit tests passing (80%+ coverage)
- [ ] Integration tests covering critical workflows
- [ ] E2E tests for complete user journeys
- [ ] Accessibility compliance verified
- [ ] Performance benchmarks met
- [ ] Cross-browser compatibility confirmed
- [ ] Visual regression tests stable
- [ ] Load testing completed
- [ ] Security testing performed
- [ ] User acceptance testing signed off
