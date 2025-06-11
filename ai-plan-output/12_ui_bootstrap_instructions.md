# FanForge UI Bootstrap Instructions

## Overview

This guide provides step-by-step instructions for implementing the FanForge frontend using React 18, Next.js 14 App Router, TypeScript, Tailwind CSS, and shadcn/ui components. All commands and frameworks align with the technical requirements specification.

## Prerequisites Setup

### 1. Initialize Next.js Project

```bash
npx create-next-app@14 fanforge --typescript --tailwind --eslint --app --src-dir=false
cd fanforge
```

### 2. Install Required Dependencies

```bash
npm install lucide-react react-hook-form zod @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs class-variance-authority clsx tailwind-merge
```

### 3. Install Development Dependencies

```bash
npm install --save-dev @types/node @types/react @types/react-dom prettier husky autoprefixer postcss
```

## Project Structure Setup

### 1. Create Directory Structure

```bash
mkdir -p components/{ui,forms,canvas,shared}
mkdir -p lib types
mkdir -p app/{auth,brand,creator}/
```

### 2. Configure TypeScript Paths

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

## Core Configuration Files

### 1. Tailwind Configuration

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
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

### 2. Next.js Configuration

Update `next.config.js`:

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

## Type Definitions

### 1. Create Core Types

Create `types/index.ts`:

```typescript
export interface User {
  id: string
  email: string
  role: "creator" | "brand_admin"
  name: string
  avatar_url?: string
  created_at: Date
}

export interface Campaign {
  id: string
  title: string
  description: string
  guidelines: string
  brand_name: string
  status: "draft" | "active" | "closed"
  deadline: Date
  assets: Asset[]
  submission_count: number
}

export interface Asset {
  id: string
  campaign_id: string
  filename: string
  url: string
  category: "characters" | "backgrounds" | "logos" | "titles" | "props"
  metadata: {
    width: number
    height: number
  }
}

export interface Submission {
  id: string
  campaign_id: string
  creator_id: string
  title: string
  description: string
  artwork_url: string
  status: "pending" | "approved" | "rejected"
  feedback?: string
  created_at: Date
}
```

## Utility Functions

### 1. Create Utility Library

Create `lib/utils.ts`:

```typescript
import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}
```

### 2. Create Validation Schemas

Create `lib/validations.ts`:

```typescript
import {z} from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["creator", "brand_admin"]),
})

export const campaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  guidelines: z.string().min(20, "Guidelines must be at least 20 characters"),
  deadline: z.date().min(new Date(), "Deadline must be in the future"),
})
```

## UI Components Implementation

### 1. Button Component

Create `components/ui/button.tsx`:

```typescript
import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
        outline:
          "border border-primary-500 text-primary-500 hover:bg-primary-50",
        ghost: "hover:bg-neutral-100",
        destructive: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, loading, children, ...props}, ref) => {
    return (
      <button
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <span className='mr-2 h-4 w-4 animate-spin'>⟳</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export {Button, buttonVariants}
```

### 2. Input Component

Create `components/ui/input.tsx`:

```typescript
import * as React from "react"
import {cn} from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, error, ...props}, ref) => {
    return (
      <div className='space-y-1'>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>
    )
  }
)

Input.displayName = "Input"

export {Input}
```

### 3. Card Component

Create `components/ui/card.tsx`:

```typescript
import * as React from "react"
import {cn} from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-neutral-200 bg-white shadow-sm",
      className
    )}
    {...props}
  />
))

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({className, ...props}, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardContent.displayName = "CardContent"

export {Card, CardHeader, CardTitle, CardContent}
```

## Layout Implementation

### 1. Root Layout

Update `app/layout.tsx`:

```typescript
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "FanForge - Create with Official Brand Assets",
  description:
    "Collaborative platform for sanctioned derivative content creation",
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='min-h-screen bg-neutral-50'>{children}</div>
      </body>
    </html>
  )
}
```

### 2. Navigation Component

Create `components/ui/navigation.tsx`:

```typescript
"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import {User} from "@/types"

interface NavigationProps {
  user?: User
}

export function Navigation({user}: NavigationProps) {
  const pathname = usePathname()

  const creatorLinks = [
    {href: "/discover", label: "Discover"},
    {href: "/portfolio", label: "My Work"},
    {href: "/profile", label: "Profile"},
  ]

  const brandLinks = [
    {href: "/dashboard", label: "Dashboard"},
    {href: "/campaigns", label: "Campaigns"},
    {href: "/submissions", label: "Reviews"},
  ]

  const links = user?.role === "creator" ? creatorLinks : brandLinks

  return (
    <nav className='border-b border-neutral-200 bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex'>
            <Link href='/' className='flex items-center'>
              <span className='text-xl font-bold text-primary-500'>
                FanForge
              </span>
            </Link>
            {user && (
              <div className='ml-10 flex space-x-8'>
                {links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium",
                      pathname === link.href
                        ? "border-b-2 border-primary-500 text-primary-600"
                        : "text-neutral-500 hover:text-neutral-700"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

## Page Implementation

### 1. Landing Page

Update `app/page.tsx`:

```typescript
import Link from "next/link"
import {Button} from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50'>
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl'>
            Create with Official Brand Assets
          </h1>
          <p className='mt-6 text-lg leading-8 text-neutral-600'>
            FanForge connects creators with brands through sanctioned derivative
            content creation. Express your creativity legally while building
            your portfolio with official assets.
          </p>
          <div className='mt-10 flex items-center justify-center gap-x-6'>
            <Link href='/register'>
              <Button size='lg'>Get Started</Button>
            </Link>
            <Link href='/login'>
              <Button variant='outline' size='lg'>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 2. Authentication Pages

Create `app/(auth)/login/page.tsx`:

```typescript
"use client"

import {useState} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card"
import {loginSchema} from "@/lib/validations"
import type {z} from "zod"

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    // Mock login logic
    console.log("Login:", data)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-neutral-50'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Sign In to FanForge</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <Input
              type='email'
              placeholder='Email address'
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              type='password'
              placeholder='Password'
              {...register("password")}
              error={errors.password?.message}
            />
            <Button type='submit' className='w-full' loading={loading}>
              Sign In
            </Button>
          </form>
          <p className='mt-4 text-center text-sm text-neutral-600'>
            Don't have an account?{" "}
            <Link href='/register' className='text-primary-500 hover:underline'>
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Canvas Implementation

### 1. Creation Canvas Component

Create `components/canvas/creation-canvas.tsx`:

```typescript
"use client"

import {useState, useRef} from "react"
import {Asset} from "@/types"

interface CanvasElement {
  id: string
  asset: Asset
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
}

interface CreationCanvasProps {
  assets: Asset[]
  onSave: (elements: CanvasElement[]) => void
}

export function CreationCanvas({assets, onSave}: CreationCanvasProps) {
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const assetId = e.dataTransfer.getData("assetId")
    const asset = assets.find(a => a.id === assetId)

    if (asset && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newElement: CanvasElement = {
        id: `element-${Date.now()}`,
        asset,
        x,
        y,
        width: 100,
        height: 100,
        rotation: 0,
        zIndex: elements.length,
      }

      setElements([...elements, newElement])
    }
  }

  return (
    <div className='flex h-screen'>
      {/* Asset Palette */}
      <div className='w-64 border-r border-neutral-200 bg-white p-4'>
        <h3 className='font-semibold mb-4'>Assets</h3>
        <div className='grid grid-cols-2 gap-2'>
          {assets.map(asset => (
            <div
              key={asset.id}
              draggable
              onDragStart={e => e.dataTransfer.setData("assetId", asset.id)}
              className='aspect-square border border-neutral-200 rounded cursor-move hover:border-primary-500'
            >
              <img
                src={asset.url}
                alt={asset.filename}
                className='w-full h-full object-cover rounded'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className='flex-1 bg-neutral-100'>
        <div
          ref={canvasRef}
          className='relative w-full h-full bg-white m-4 border border-neutral-300 rounded'
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          {elements.map(element => (
            <div
              key={element.id}
              className={`absolute cursor-move border-2 ${
                selectedElement === element.id
                  ? "border-primary-500"
                  : "border-transparent"
              }`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: `rotate(${element.rotation}deg)`,
                zIndex: element.zIndex,
              }}
              onClick={() => setSelectedElement(element.id)}
            >
              <img
                src={element.asset.url}
                alt={element.asset.filename}
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Properties Panel */}
      <div className='w-64 border-l border-neutral-200 bg-white p-4'>
        <h3 className='font-semibold mb-4'>Properties</h3>
        {selectedElement && (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Width</label>
              <input
                type='number'
                className='w-full px-3 py-2 border border-neutral-300 rounded'
                value={elements.find(e => e.id === selectedElement)?.width || 0}
                onChange={e => {
                  const value = parseInt(e.target.value)
                  setElements(
                    elements.map(el =>
                      el.id === selectedElement ? {...el, width: value} : el
                    )
                  )
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

## Mock Data Implementation

### 1. Create Mock Data

Create `lib/mock-data.ts`:

```typescript
import {Campaign, Asset, Submission, User} from "@/types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "maya@example.com",
    role: "creator",
    name: "Maya Chen",
    created_at: new Date(),
  },
  {
    id: "2",
    email: "david@example.com",
    role: "brand_admin",
    name: "David Rodriguez",
    created_at: new Date(),
  },
]

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Anime Heroes Collection",
    description:
      "Create amazing artwork using our official anime character assets",
    guidelines:
      "Use provided characters in creative compositions. No violent themes.",
    brand_name: "Studio Ghibli",
    status: "active",
    deadline: new Date("2025-08-01"),
    assets: [],
    submission_count: 24,
  },
]

export const mockAssets: Asset[] = [
  {
    id: "1",
    campaign_id: "1",
    filename: "hero-character.png",
    url: "/placeholder.svg?height=200&width=200",
    category: "characters",
    metadata: {width: 200, height: 200},
  },
]
```

## Technology Stack Validation

All implementation instructions align with technical requirements:

- **Framework:** React 18 + Next.js 14 App Router ✓
- **Language:** TypeScript 5.0 ✓
- **Styling:** Tailwind CSS 3.3 + shadcn/ui ✓
- **Icons:** Lucide React ✓
- **State Management:** React Hooks ✓
- **Form Handling:** React Hook Form + Zod ✓
- **Commands:** `npm install`, `npm run dev`, `npm run build` ✓

## Next Steps

1. Run `npm run dev` to start development server
2. Implement remaining pages following the wireflow specification
3. Add responsive design breakpoints
4. Implement dark mode toggle
5. Add accessibility features (ARIA labels, keyboard navigation)
6. Optimize performance with lazy loading and code splitting
