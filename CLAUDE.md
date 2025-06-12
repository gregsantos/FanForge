# CLAUDE.md

This file provides comprehensive guidance to Claude Code and other AI coding assistants when working with the FanForge codebase.

## Project Overview

FanForge is a collaborative platform connecting IP owners with fan creators through sanctioned derivative content creation campaigns. Built with Next.js 14 App Router, React 18, TypeScript, and shadcn/ui components.

## Development Commands

```bash
# Setup
npm install                  # Install dependencies

# Development
npm run dev                 # Start dev server (localhost:3000)
npm run type-check         # TypeScript validation
npm run lint               # ESLint checks
npm run lint:fix           # Auto-fix linting issues  
npm run format             # Format with Prettier
npm run format:check       # Check formatting

# Build & Deploy
npm run build              # Production build
npm run export             # Static export
npm run start              # Serve production build

# Testing
npm run test               # Run Jest test suite
```

## Technology Stack

**Core Framework:**
- Next.js 14.0.0 (App Router)
- React 18.2.0 
- TypeScript 5.0.0
- Node.js 18.17.0+ (recommended 20.9.0)

**UI & Styling:**
- Tailwind CSS 3.3.0
- shadcn/ui components (Radix UI primitives)
- Lucide React 0.294.0 (icons only)
- class-variance-authority + clsx + tailwind-merge

**Forms & Validation:**
- React Hook Form 7.47.0
- Zod 3.22.0 validation schemas
- @hookform/resolvers

**Development Tools:**
- ESLint + eslint-config-next
- Prettier
- Jest + @testing-library/react
- Husky (git hooks)

**Build & Deployment:**
- Static export configuration
- Vercel deployment target

## Architecture & File Structure

```
app/                     # Next.js 14 App Router
├── (auth)/             # Auth routes: login, register  
├── (brand)/            # Brand admin: dashboard, campaigns, submissions
├── (creator)/          # Creator routes: discover, create, portfolio
├── api/                # API routes with mock data
├── globals.css         # Global Tailwind styles
├── layout.tsx          # Root layout with providers
└── page.tsx            # Landing page

components/
├── ui/                 # shadcn/ui base components  
├── canvas/             # Drag-and-drop creation canvas
└── shared/             # Shared UI components

lib/
├── utils.ts            # Utility functions (cn, etc.)
├── validations.ts      # Zod schemas for forms/API
└── mock-data.ts        # Development mock data

types/
└── index.ts            # Global TypeScript definitions
```

## Core Features & Data Models

**Authentication:** Role-based system (Creator/Brand Admin)
**Campaigns:** Brand-created content creation opportunities  
**Submissions:** Creator artwork submissions with review workflow
**Canvas:** Drag-and-drop composition tool using brand assets

**Key Types:**
```typescript
User: { id, email, role, profile, createdAt }
Campaign: { id, title, description, brandId, assets, status, deadline }  
Submission: { id, campaignId, creatorId, artwork, status, feedback }
Asset: { id, campaignId, category, url, metadata }
```

## AI Coding Guidelines

### Code Quality Requirements
- TypeScript strict mode with comprehensive type definitions
- Next.js 14 App Router best practices and conventions  
- ESLint + Prettier compliance (run `npm run lint:fix` and `npm run format`)
- Functional components with React Hooks only
- Error boundaries and comprehensive error handling

### Code Style Standards
```typescript
// Import order: react → next → libraries → local
import { useState } from 'react'
import { NextPage } from 'next'
import { Button } from '@/components/ui/button'
import { validateForm } from '@/lib/validations'

// Always use interfaces, destructure props, annotate returns
interface Props { title: string; onClick: () => void }
const Component = ({ title, onClick }: Props): JSX.Element => {
  // Arrow functions, descriptive names, no abbreviations
  const handleSubmission = () => onClick()
  return <Button onClick={handleSubmission}>{title}</Button>
}
```

### Component Development
- **UI Components:** Use shadcn/ui primitives exclusively
- **Styling:** Tailwind utilities only, mobile-first responsive design
- **Icons:** Lucide React only (`import { Icon } from 'lucide-react'`)  
- **Forms:** React Hook Form + Zod validation schemas
- **State:** Local useState/useReducer, Context for global state
- **Accessibility:** ARIA labels, keyboard navigation, semantic HTML

### Testing Requirements  
- Jest + React Testing Library for component tests
- Unit tests for utilities and business logic
- API route testing with mock data
- Run `npm run test` before committing
- Target 80%+ coverage for new code

### File Placement Rules
```
components/ui/       → shadcn/ui base components
components/shared/   → Reusable business components  
components/canvas/   → Creation tool specific components
lib/                → Utilities, validations, API helpers
types/              → Global TypeScript definitions
app/api/            → API routes with mock implementations
```

## API & Mock Data

**Mock Implementation:** All API routes use placeholder data for development/demo purposes

**REST Endpoints:**

```http
GET    /api/campaigns        → List all campaigns
POST   /api/campaigns        → Create new campaign  
GET    /api/campaigns/[id]   → Campaign details
POST   /api/submissions      → Submit creator artwork
PUT    /api/submissions/[id] → Update submission status
GET    /api/auth/login       → User authentication
POST   /api/auth/register    → User registration
```

## Environment & Configuration

**Development Environment:**

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/svg+xml
```

**Build Configuration:**

- Static export enabled (`output: "export"`)
- Image optimization disabled for static hosting
- Trailing slash enabled for compatibility

## Performance & Browser Support

**Targets:**

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s  
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**Responsive Breakpoints:**

- Mobile: 320-767px
- Tablet: 768-1023px  
- Desktop: 1024px+

## Deployment & Security

**Platform:** Vercel with static export

**Security:** Input validation on API routes, HTTPS cookies, route protection middleware

## AI Development Workflow

**Pre-coding Analysis:**
1. Understand requirements and existing codebase patterns
2. Check related components and utilities for consistency
3. Plan implementation approach with proper TypeScript types

**During Development:**
1. Follow file placement rules and naming conventions
2. Run `npm run type-check` frequently during development
3. Use existing shadcn/ui components and Tailwind patterns
4. Implement proper error handling and loading states

**Quality Assurance:**
1. Run `npm run lint:fix` and `npm run format` before completion
2. Execute `npm run test` and ensure tests pass
3. Verify functionality in browser manually
4. Check mobile/tablet responsive behavior

**Pre-commit Checklist:**
- [ ] TypeScript compilation succeeds (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Formatting is consistent (`npm run format:check`)
- [ ] Tests pass (`npm run test`)
- [ ] No console errors in browser
- [ ] Responsive design works across breakpoints