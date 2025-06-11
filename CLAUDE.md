# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FanForge is a collaborative platform connecting IP owners with fan creators through sanctioned derivative content creation campaigns. Built with React 18, Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui.

## Common Development Commands

```bash
# Setup and installation
npm install                    # Install dependencies

# Development
npm run dev                   # Start development server (http://localhost:3000)
npm run type-check           # TypeScript type checking
npm run lint                 # ESLint code quality check
npm run lint:fix             # Auto-fix linting issues
npm run format               # Format code with Prettier
npm run format:check         # Check code formatting

# Build and deployment
npm run build                # Production build
npm run export               # Static HTML export
npm run start                # Serve production build locally

# Testing
npm run test                 # Run test suite
```

## Technology Stack

- **Frontend:** React 18.2.0 with Next.js 14.0.0 App Router
- **Language:** TypeScript 5.0.0  
- **Styling:** Tailwind CSS 3.3.0 with shadcn/ui components
- **Icons:** Lucide React 0.294.0 exclusively
- **Forms:** React Hook Form 7.47.0 with Zod 3.22.0 validation
- **State:** React Hooks (useState, useReducer, useContext)
- **Node.js:** 18.17.0+ (recommended 20.9.0)

## Architecture

### File Structure
```
app/
├── (auth)/              # Authentication routes - login, register
├── (brand)/             # Brand admin routes - dashboard, campaigns, submissions  
├── (creator)/           # Creator routes - discover, create, portfolio
├── api/                 # Mock API routes
├── globals.css          # Global styles
├── layout.tsx           # Root layout
└── page.tsx             # Landing page

components/
├── ui/                  # shadcn/ui base components
├── forms/               # Form components  
├── canvas/              # Drag-and-drop creation canvas
└── shared/              # Shared components

lib/
├── utils.ts             # General utilities
├── validations.ts       # Zod validation schemas
├── mock-data.ts         # Mock data for development
└── auth.ts              # Authentication utilities

types/
└── index.ts             # TypeScript type definitions
```

### Core Features
- **User Authentication:** Role-based (Creator vs Brand Admin)
- **Campaign Management:** Creation, asset kits, timelines for brand admins
- **Campaign Discovery:** Search and filtering for creators
- **Creation Canvas:** Drag-and-drop composition tool using brand assets
- **Submission Workflow:** Review and approval system
- **Portfolio Management:** Creator showcase of approved works

### Data Models
- **User:** id, email, role, profile, createdAt
- **Campaign:** id, title, description, brandId, assets, status, deadline
- **Submission:** id, campaignId, creatorId, artwork, status, feedback
- **Asset:** id, campaignId, category (Characters, Backgrounds, Logos, Titles, Props), url, metadata

## Development Guidelines

### Code Style
- Use TypeScript interfaces for all props and data structures
- Follow functional components with React Hooks
- Use Tailwind utility classes (no custom CSS)
- Implement responsive design with mobile-first approach
- Support dark mode using `dark:` prefix classes
- Use descriptive variable names, avoid abbreviations

### Component Patterns
- Place components in appropriate directories (ui/, forms/, canvas/, shared/)
- Use shadcn/ui component library patterns
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Validate forms with React Hook Form + Zod schemas
- Use Lucide React icons exclusively

### State Management
- Local state: useState, useReducer
- Global state: Context API when needed
- Form state: React Hook Form
- Data validation: Zod schemas

## Environment Configuration

Required environment variables:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/svg+xml
```

## Mock Data Implementation

The application uses mock APIs with placeholder data for demonstrable UX. API endpoints follow REST conventions:
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign  
- `GET /api/campaigns/[id]` - Campaign details
- `POST /api/submissions` - Submit artwork
- `PUT /api/submissions/[id]` - Update submission status

## Performance Requirements

- First Contentful Paint: < 1.5 seconds
- Largest Contentful Paint: < 2.5 seconds
- Browser support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Responsive breakpoints: Mobile (320-767px), Tablet (768-1023px), Desktop (1024px+)

## Deployment

- Target platform: Vercel (static export)
- Next.js configuration includes `output: "export"` and `trailingSlash: true`
- Images use `unoptimized: true` for static hosting compatibility