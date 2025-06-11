# FanForge Technical Requirements

## Technology Stack

### Frontend Framework

- **React:** 18.2.0
- **Next.js:** 14.0.0 with App Router
- **TypeScript:** 5.0.0
- **Node.js:** 18.17.0 or higher

### Styling & UI

- **Tailwind CSS:** 3.3.0
- **shadcn/ui:** Latest component library
- **Lucide React:** 0.294.0 (icons exclusively)
- **CSS Modules:** Built-in Next.js support

### State Management & Data

- **React Hooks:** useState, useReducer, useContext, useEffect
- **React Hook Form:** 7.47.0 (form handling)
- **Zod:** 3.22.0 (validation schemas)
- **Mock APIs:** Custom implementation with placeholder data

### Development Tools

- **ESLint:** 8.52.0
- **Prettier:** 3.0.0
- **TypeScript ESLint:** 6.9.0
- **Husky:** 8.0.0 (git hooks)

### Build & Deployment

- **Vercel:** Recommended hosting platform
- **Static Export:** Next.js static site generation
- **Package Manager:** npm (not yarn or pnpm)

## Required Libraries

### Frontend Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "next": "^14.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "lucide-react": "^0.294.0",
  "react-hook-form": "^7.47.0",
  "zod": "^3.22.0",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-tabs": "^1.0.4",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### Development Dependencies

```json
{
  "@types/node": "^20.8.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "eslint": "^8.52.0",
  "eslint-config-next": "^14.0.0",
  "prettier": "^3.0.0",
  "husky": "^8.0.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.31"
}
```

## Development Commands

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Static Export

```bash
npm run export
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm run test
```

## Version Requirements

| Technology | Minimum Version | Recommended Version |
| ---------- | --------------- | ------------------- |
| Node.js    | 18.17.0         | 20.9.0              |
| npm        | 9.0.0           | 10.2.0              |
| React      | 18.2.0          | 18.2.0              |
| Next.js    | 14.0.0          | 14.0.0              |
| TypeScript | 5.0.0           | 5.2.0               |

## Technical Constraints

### Performance Requirements

- **First Contentful Paint:** < 1.5 seconds
- **Largest Contentful Paint:** < 2.5 seconds
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### Browser Support

- **Chrome:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Edge:** 90+

### Responsive Breakpoints

- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+

### Accessibility Standards

- **WCAG:** 2.1 AA compliance
- **ARIA:** Proper labeling and roles
- **Keyboard Navigation:** Full support
- **Screen Reader:** Compatible

## File Structure Requirements

```
fanforge/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (brand)/
│   │   ├── dashboard/
│   │   ├── campaigns/
│   │   └── submissions/
│   ├── (creator)/
│   │   ├── discover/
│   │   ├── create/
│   │   └── portfolio/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   ├── canvas/
│   └── shared/
├── lib/
│   ├── utils.ts
│   ├── validations.ts
│   └── mock-data.ts
├── types/
│   └── index.ts
├── public/
│   └── placeholder.svg
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## Environment Configuration

### Required Environment Variables

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Next.js Configuration

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

## Mock Data Requirements

### Data Models

- **User:** id, email, role, profile, createdAt
- **Campaign:** id, title, description, brandId, assets, status, deadline
- **Submission:** id, campaignId, creatorId, artwork, status, feedback
- **Asset:** id, campaignId, category, url, metadata

### API Endpoints (Mock)

- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/[id]` - Get campaign details
- `POST /api/submissions` - Submit artwork
- `GET /api/submissions` - List submissions
- `PUT /api/submissions/[id]` - Update submission status

## Security Requirements

### Authentication

- JWT token-based authentication (mocked)
- Role-based access control (Creator vs Brand Admin)
- Session management and timeout

### Data Validation

- Client-side validation with Zod schemas
- Form validation with React Hook Form
- File upload validation and sanitization

### Content Security

- XSS prevention through React's built-in protection
- CSRF protection for form submissions
- Secure file handling for asset uploads

## Performance Optimization

### Code Splitting

- Route-based code splitting with Next.js App Router
- Component-level lazy loading where appropriate
- Dynamic imports for heavy components

### Asset Optimization

- Image optimization with Next.js Image component
- SVG sprite optimization for icons
- CSS purging with Tailwind CSS

### Caching Strategy

- Static generation for public pages
- Client-side caching for API responses
- Browser caching for static assets
