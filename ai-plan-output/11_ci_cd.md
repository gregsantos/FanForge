# FanForge CI/CD & Repository Structure

## Repository Structure

```
fanforge/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── pr-checks.yml
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (brand)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── campaigns/
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── submissions/
│   │       └── page.tsx
│   ├── (creator)/
│   │   ├── discover/
│   │   │   └── page.tsx
│   │   ├── campaigns/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── create/
│   │   │   └── [campaignId]/
│   │   │       └── page.tsx
│   │   └── portfolio/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   ├── campaigns/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── submissions/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── review/
│   │               └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   └── navigation.tsx
│   ├── forms/
│   │   ├── auth-form.tsx
│   │   ├── campaign-form.tsx
│   │   └── submission-form.tsx
│   ├── canvas/
│   │   ├── creation-canvas.tsx
│   │   ├── asset-palette.tsx
│   │   └── properties-panel.tsx
│   └── shared/
│       ├── campaign-card.tsx
│       ├── submission-card.tsx
│       └── user-avatar.tsx
├── lib/
│   ├── utils.ts
│   ├── validations.ts
│   ├── mock-data.ts
│   └── auth.ts
├── types/
│   └── index.ts
├── public/
│   ├── placeholder.svg
│   └── favicon.ico
├── .env.local
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## CI/CD Configuration

### GitHub Actions Workflow - CI Pipeline

**File:** `.github/workflows/ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run type-check

      - name: Run Prettier check
        run: npm run format:check

  build:
    runs-on: ubuntu-latest
    needs: lint-and-type-check

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: .next/

  test:
    runs-on: ubuntu-latest
    needs: lint-and-type-check

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm run test
```

### GitHub Actions Workflow - Deployment

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitHub Actions Workflow - PR Checks

**File:** `.github/workflows/pr-checks.yml`

```yaml
name: PR Checks

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  pr-validation:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Run full test suite
        run: npm run test:ci

      - name: Build for production
        run: npm run build

      - name: Check bundle size
        run: npm run analyze
```

## Package.json Scripts

```json
{
  "name": "fanforge",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build && next export",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

## Environment Variables

### Required Environment Variables

**File:** `.env.example`

```bash
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development

# Authentication (Mock)
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/svg+xml

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### Production Environment Variables

```bash
# Vercel Deployment
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id

# Production URLs
NEXT_PUBLIC_APP_URL=https://fanforge.vercel.app
NEXT_PUBLIC_API_URL=https://fanforge.vercel.app/api
```

## Configuration Files

### Next.js Configuration

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: true,
  },
  eslint: {
    dirs: ["app", "components", "lib", "types"],
  },
}

module.exports = nextConfig
```

### TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/types/*": ["types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### ESLint Configuration

**File:** `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuration

**File:** `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Tailwind Configuration

**File:** `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#0ea5e9",
          900: "#0c4a6e",
        },
        secondary: {
          50: "#fdf4ff",
          500: "#d946ef",
          900: "#701a75",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## Deployment Strategy

### Vercel Deployment

1. **Automatic Deployments:**

   - Main branch → Production deployment
   - Feature branches → Preview deployments
   - Pull requests → Preview deployments with comments

2. **Build Configuration:**

   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`
   - Install command: `npm install`

3. **Environment Variables:**
   - Production variables set in Vercel dashboard
   - Preview deployments use development variables
   - Secrets managed through Vercel environment variables

### Performance Monitoring

1. **Vercel Analytics:**

   - Core Web Vitals tracking
   - Page performance monitoring
   - User experience metrics

2. **Build Optimization:**
   - Bundle size analysis
   - Code splitting verification
   - Asset optimization checks

## Technology Stack Validation

All commands and configurations align with technical requirements:

- **Package Manager:** npm ✓
- **Development Server:** `npm run dev` ✓
- **Production Build:** `npm run build` ✓
- **Type Checking:** `npm run type-check` ✓
- **Linting:** `npm run lint` ✓
- **Testing:** `npm run test` ✓
- **Framework:** Next.js 14 with App Router ✓
- **Language:** TypeScript 5.0 ✓
- **Styling:** Tailwind CSS 3.3 ✓
