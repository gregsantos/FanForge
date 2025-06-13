# FanForge Design Tokens & Component Library

## Design System Overview

FanForge's design system embodies the brand personality: **Modern, Creative, Professional, Collaborative, Empowering, Trustworthy, Intuitive**. The system prioritizes accessibility, consistency, and creative expression while maintaining professional credibility.

## Color Tokens

### Primary Colors

```css
--color-primary-50: #f0f9ff;
--color-primary-100: #e0f2fe;
--color-primary-200: #bae6fd;
--color-primary-300: #7dd3fc;
--color-primary-400: #38bdf8;
--color-primary-500: #0ea5e9; /* Primary brand color */
--color-primary-600: #0284c7;
--color-primary-700: #0369a1;
--color-primary-800: #075985;
--color-primary-900: #0c4a6e;
```

### Secondary Colors

```css
--color-secondary-50: #fdf4ff;
--color-secondary-100: #fae8ff;
--color-secondary-200: #f5d0fe;
--color-secondary-300: #f0abfc;
--color-secondary-400: #e879f9;
--color-secondary-500: #d946ef; /* Creative accent */
--color-secondary-600: #c026d3;
--color-secondary-700: #a21caf;
--color-secondary-800: #86198f;
--color-secondary-900: #701a75;
```

### Neutral Colors

```css
--color-neutral-50: #fafafa;
--color-neutral-100: #f5f5f5;
--color-neutral-200: #e5e5e5;
--color-neutral-300: #d4d4d4;
--color-neutral-400: #a3a3a3;
--color-neutral-500: #737373;
--color-neutral-600: #525252;
--color-neutral-700: #404040;
--color-neutral-800: #262626;
--color-neutral-900: #171717;
```

### Semantic Colors

```css
--color-success-500: #10b981;
--color-warning-500: #f59e0b;
--color-error-500: #ef4444;
--color-info-500: #3b82f6;
```

### Dark Mode Colors

```css
--color-dark-bg-primary: #0f0f23;
--color-dark-bg-secondary: #1a1a2e;
--color-dark-bg-tertiary: #16213e;
--color-dark-text-primary: #ffffff;
--color-dark-text-secondary: #a1a1aa;
--color-dark-border: #27272a;
```

## Typography Tokens

### Font Families

```css
--font-primary:
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", Consolas, monospace;
```

### Font Sizes

```css
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */
--text-5xl: 3rem; /* 48px */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights

```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## Spacing Tokens

### Spacing Scale

```css
--space-0: 0;
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

## Border Radius Tokens

```css
--radius-none: 0;
--radius-sm: 0.125rem; /* 2px */
--radius-base: 0.25rem; /* 4px */
--radius-md: 0.375rem; /* 6px */
--radius-lg: 0.5rem; /* 8px */
--radius-xl: 0.75rem; /* 12px */
--radius-2xl: 1rem; /* 16px */
--radius-full: 9999px;
```

## Shadow Tokens

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl:
  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

## Component Library

### Button Component

```typescript
interface ButtonProps {
  variant: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size: "sm" | "md" | "lg"
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
}
```

**States:**

- Default: Primary color with medium padding
- Hover: Darker shade with subtle scale transform
- Active: Pressed state with inner shadow
- Disabled: Reduced opacity with no interactions
- Loading: Spinner icon with disabled state

### Input Component

```typescript
interface InputProps {
  type: "text" | "email" | "password" | "search"
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}
```

**States:**

- Default: Neutral border with focus ring
- Focus: Primary border with enhanced shadow
- Error: Error color border with message
- Disabled: Reduced opacity and no interactions

### Card Component

```typescript
interface CardProps {
  variant: "default" | "elevated" | "outlined"
  padding: "sm" | "md" | "lg"
  children: React.ReactNode
}
```

**States:**

- Default: Subtle background with border
- Elevated: Enhanced shadow for prominence
- Outlined: Border-only styling
- Hover: Subtle shadow increase (for interactive cards)

### Badge Component

```typescript
interface BadgeProps {
  variant: "default" | "success" | "warning" | "error" | "info"
  size: "sm" | "md"
  children: React.ReactNode
}
```

**Variants:**

- Default: Neutral colors for general use
- Success: Green for approved/completed states
- Warning: Yellow for pending/attention states
- Error: Red for rejected/error states
- Info: Blue for informational content

### Navigation Component

```typescript
interface NavigationProps {
  items: NavigationItem[]
  activeItem: string
  userRole: "creator" | "brand_admin"
  collapsed?: boolean
}
```

**States:**

- Default: Clean navigation with role-based items
- Active: Highlighted current page indicator
- Hover: Subtle background change
- Collapsed: Mobile-friendly drawer state

### Modal Component

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
}
```

**Features:**

- Backdrop blur with click-to-close
- Escape key handling
- Focus trap for accessibility
- Smooth enter/exit animations

### Canvas Component

```typescript
interface CanvasProps {
  assets: Asset[]
  onAssetDrop: (asset: Asset, position: Position) => void
  onElementSelect: (element: CanvasElement) => void
  selectedElement?: CanvasElement
}
```

**Features:**

- Drag-and-drop asset placement
- Multi-select with keyboard modifiers
- Zoom and pan controls
- Layer management
- Undo/redo functionality

### Asset Palette Component

```typescript
interface AssetPaletteProps {
  assets: Asset[]
  categories: AssetCategory[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}
```

**Features:**

- Categorized asset organization
- Search and filter functionality
- Thumbnail previews
- Drag initiation for canvas

## Animation Tokens

### Transitions

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

### Easing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## Responsive Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## Accessibility Tokens

### Focus Indicators

```css
--focus-ring: 0 0 0 2px var(--color-primary-500);
--focus-ring-offset: 0 0 0 2px white, 0 0 0 4px var(--color-primary-500);
```

### Minimum Touch Targets

```css
--touch-target-min: 44px;
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  --color-primary-500: #0066cc;
  --color-text-primary: #000000;
  --color-border: #000000;
}
```

## Usage Guidelines

### Color Usage

- **Primary Blue:** Main actions, links, brand elements
- **Secondary Purple:** Creative features, highlights, accents
- **Neutral Gray:** Text, borders, backgrounds
- **Semantic Colors:** Status indicators, feedback, alerts

### Typography Hierarchy

- **Headings:** Bold weights for clear hierarchy
- **Body Text:** Normal weight for readability
- **Captions:** Lighter weight for secondary information
- **Code:** Monospace font for technical content

### Spacing Consistency

- **Component Padding:** Use 4, 6, 8 spacing units
- **Layout Margins:** Use 8, 12, 16 spacing units
- **Section Gaps:** Use 16, 20, 24 spacing units

### Component States

- **Interactive Elements:** Clear hover and focus states
- **Loading States:** Consistent spinner and skeleton patterns
- **Empty States:** Helpful messaging with clear actions
- **Error States:** Descriptive messages with recovery options
