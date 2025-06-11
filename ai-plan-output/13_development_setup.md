# FanForge Development Setup Guide

## Prerequisites

### System Requirements

- **Node.js:** 18.17.0 or higher (recommended: 20.9.0)
- **npm:** 9.0.0 or higher (recommended: 10.2.0)
- **Git:** Latest version
- **Code Editor:** VS Code (recommended) with TypeScript and Tailwind CSS extensions

### Verify Prerequisites

```bash
node --version  # Should be 18.17.0+
npm --version   # Should be 9.0.0+
git --version   # Any recent version
```

## Project Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd fanforge
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies as specified in `package.json`:

- React 18.2.0
- Next.js 14.0.0
- TypeScript 5.0.0
- Tailwind CSS 3.3.0
- Lucide React 0.294.0
- React Hook Form 7.47.0
- Zod 3.22.0
- shadcn/ui components

### 3. Environment Configuration

#### Create Environment File

```bash
cp .env.example .env.local
```

#### Configure Environment Variables

Edit `.env.local` with your local settings:

```bash
# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development

# Authentication (Mock)
NEXT_PUBLIC_JWT_SECRET=your-local-jwt-secret-key

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/svg+xml

# Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

This command:

- Starts Next.js development server on `http://localhost:3000`
- Enables hot reloading for instant updates
- Provides TypeScript error checking
- Activates Tailwind CSS compilation

### 2. Verify Setup

Open your browser and navigate to `http://localhost:3000`. You should see the FanForge landing page.

### 3. Development Commands

#### Type Checking

```bash
npm run type-check
```

Runs TypeScript compiler to check for type errors without emitting files.

#### Linting

```bash
npm run lint
```

Runs ESLint to check code quality and style issues.

#### Fix Linting Issues

```bash
npm run lint:fix
```

Automatically fixes linting issues where possible.

#### Format Code

```bash
npm run format
```

Formats code using Prettier.

#### Check Code Formatting

```bash
npm run format:check
```

Checks if code is properly formatted without making changes.

## Project Structure Overview

```
fanforge/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (brand)/           # Brand admin routes
│   ├── (creator)/         # Creator routes
│   ├── api/               # API routes (mock)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   ├── canvas/            # Canvas-related components
│   └── shared/            # Shared components
├── lib/                   # Utility functions
│   ├── utils.ts           # General utilities
│   ├── validations.ts     # Zod schemas
│   ├── mock-data.ts       # Mock data for development
│   └── auth.ts            # Authentication utilities
├── types/                 # TypeScript type definitions
│   └── index.ts           # Core types
├── public/                # Static assets
│   └── placeholder.svg    # Placeholder images
└── Configuration files
```

## IDE Configuration

### VS Code Extensions (Recommended)

Install these extensions for optimal development experience:

```bash
# Essential Extensions
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### VS Code Workspace Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

## Build and Testing

### Production Build

```bash
npm run build
```

Creates optimized production build in `.next` directory.

### Static Export

```bash
npm run export
```

Generates static HTML export for deployment.

### Test Build Locally

```bash
npm run build
npm run start
```

Builds and serves the production version locally.

## Development Best Practices

### 1. Code Organization

- Place components in appropriate directories (`ui/`, `forms/`, `canvas/`, `shared/`)
- Use TypeScript interfaces for all props and data structures
- Follow the established naming conventions

### 2. Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design token system defined in `design_tokens.md`
- Implement responsive design using Tailwind breakpoints
- Support dark mode using the `dark:` prefix

### 3. Component Development

- Use functional components with TypeScript
- Implement proper prop validation with TypeScript interfaces
- Add accessibility attributes (ARIA labels, roles)
- Follow the component patterns established in `ui/` directory

### 4. State Management

- Use React Hooks for local state (`useState`, `useReducer`)
- Use Context API for global state when needed
- Implement form state with React Hook Form
- Validate data with Zod schemas

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

#### Node Modules Issues

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Command Palette: "TypeScript: Restart TS Server"
# Or run type check
npm run type-check
```

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Performance Optimization

#### Development Performance

- Use `npm run dev` for development (includes hot reloading)
- Enable TypeScript strict mode for better error catching
- Use React DevTools browser extension for debugging

#### Build Performance

- Monitor bundle size with `npm run analyze`
- Use dynamic imports for code splitting
- Optimize images using Next.js Image component

## Git Workflow

### Branch Naming Convention

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring

### Commit Message Format

```
type(scope): description

Examples:
feat(auth): add user registration form
fix(canvas): resolve drag and drop positioning
docs(readme): update setup instructions
style(ui): improve button component styling
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks:

- Runs ESLint on staged files
- Runs Prettier formatting
- Runs TypeScript type checking

## Deployment Preparation

### Environment Variables for Production

Set these in your deployment platform:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NODE_ENV=production
```

### Build Verification

Before deploying, verify the build works:

```bash
npm run build
npm run start
```

## Command Validation

All commands align with technical requirements:

- **Installation:** `npm install` ✓
- **Development:** `npm run dev` ✓
- **Build:** `npm run build` ✓
- **Type Check:** `npm run type-check` ✓
- **Lint:** `npm run lint` ✓
- **Format:** `npm run format` ✓
- **Test:** `npm run test` ✓

## Support and Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Getting Help

1. Check the troubleshooting section above
2. Review the technical requirements document
3. Consult the wireflow and design specifications
4. Check GitHub issues for similar problems
