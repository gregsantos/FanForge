# FanForge Design & Interaction Style Guide  
*Version 1.0 · 2025‑06‑13*  

---

## 1. Purpose & Audience  
This guide defines the **visual language, interaction rules, and code conventions** that an agentic coding system should follow when generating FanForge screens and components.  
Goals:

- Ship a **cohesive, beautiful UI** that feels lively yet professional.  
- Encode **accessibility & performance** best‑practices by default.  
- Leverage **Framer Motion** for subtle, polished animation without compromising user preference or CLS.  

Agents must treat every section as a spec—deviations require an explicit override.

---

## 2. Design Tokens  

| Token Category | Variable | Light | Dark | Notes |
|----------------|----------|-------|------|-------|
| **Brand Color** | `--color-primary` | `#6750F8` | `#8B7BFF` | Indigo accent |
| **Surface** | `--color-surface` | `#FFFFFF` | `#121212` | Base layer |
| **Surface Alt** | `--color-surface-2` | `#F4F4F5` | `#1E1E1E` | Cards, modals |
| **Text High** | `--color-text` | `#11181C` | `#EBEBEB` | 90% contrast |
| **Text Low** | `--color-text-muted` | `#6B7280` | `#9CA3AF` | 60% contrast |
| **Success** | `--color-success` | `#10B981` | `#34D399` | — |
| **Warning** | `--color-warning` | `#F59E0B` | `#FBBF24` | — |
| **Error** | `--color-error` | `#EF4444` | `#F87171` | — |

### Typography  
```css
--font-sans: "Inter", ui-sans-serif, system-ui;
--font-display: "Lexend", var(--font-sans);

--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-md: 1rem;      /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.5rem;    /* 24px */
--font-size-2xl: 2rem;     /* 32px */
```

### Spacing & Radius  
- Base spacing unit: **4 px** (`--space-1`).  
- Use multiples (1 → 4 px, 2 → 8 px, 3 → 12 px…).  
- Border radius:  
  - Small buttons/cards: `--radius-sm: 6px`  
  - Large containers: `--radius-lg: 12px`

---

## 3. Grid & Layout  
- **Max content width:** 1280 px.  
- **12‑column fluid grid** (mobile uses 4‑column).  
- **Section padding:** `--space-6` (24 px) mobile, doubles at ≥768 px.

---

## 4. Components Library  

| Component | Purpose | Notes |
|-----------|---------|-------|
| **Button** | Primary, Secondary, Tertiary | Uses `data-variant` attr; full‑width on mobile |
| **Card** | Campaign preview, asset tile | Elevation 1 (`shadow-sm`) |
| **Modal/Dialog** | Auth, confirmations | `@radix-ui/react-dialog` |
| **Tabs** | Dashboard sub‑views | Radix Tabs; lazy‑mount panels |
| **Tooltip** | Icon hints | 200 ms delay; arrow centered |
| **Creation Canvas** | Drag‑n‑Drop | Uses Framer Motion layout animations |
| **Badge** | Status pills | Success/Warning/Error palette |

Each component lives in `components/ui/` with matching `*.test.tsx`.

---

## 5. Animation Guidelines (Framer Motion)  

| Token | Value | Use |
|-------|-------|-----|
| `duration.fast` | `0.15` | Button hover |
| `duration.base` | `0.25` | Fade/slide in |
| `duration.slow` | `0.45` | Modals, page transitions |
| `easing.default` | `[0.4, 0, 0.2, 1]` | Most motions |
| `stagger.children` | `0.05` | Lists/Grids |

### Variants Example  

```ts
// lib/animation.ts
export const fadeSlide = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

export const stagger = {
  show: { transition: { staggerChildren: 0.05 } },
};
```

### Best‑Practices  
1. **Respect user preference:**  
   ```ts
   const reduced = useReducedMotion();
   const animate = reduced ? false : 'show';
   ```  
2. **Avoid layout shift:** use `layout` prop and `position: relative`.  
3. **No blocking animations**—keep main thread free (< 16 ms).  

---

## 6. Interaction Patterns  

| State | Visual Cue | VoiceOver/ARIA |
|-------|------------|----------------|
| Hover | 4% surface tint, cursor pointer | `role="button"` |
| Focus | `2px` outline `--color-primary` | `tabindex="0"` |
| Disabled | 40% opacity, no shadow | `aria-disabled="true"` |

Error messaging: inline under field + toast summary (`role="alert"`).

---

## 7. Accessibility Checklist  
- Color contrast ≥ 4.5:1 for text, 3:1 for icons.  
- All interactive elements reachable via **Tab** key.  
- `motionPreference` respected.  
- Form fields labelled with `<label htmlFor>`.  
- Live regions use polite announcements (`aria-live="polite"`).  

---

## 8. Theming & Dark Mode  
- Theme is toggled with `data-theme="dark"` on `<html>`.  
- Tokens auto‑swap via CSS variables.  
- Images/illustrations supply a dark variant where needed.

---

## 9. Code Conventions  
- Components: **PascalCase** file & export (`Button.tsx`).  
- Hooks: prefix with `use`.  
- Tests: colocate `<Component>.test.tsx`.  
- Motion variants live in `lib/animation.ts`.  
- Use **clsx** + **tailwind-merge** for class composition.  
- Always export a **Storybook CSF** story (future integration).

---

## 10. Example Usage  

```tsx
import { motion } from 'framer-motion';
import { fadeSlide } from '@/lib/animation';

export function CampaignCard({ children }) {
  return (
    <motion.article
      variants={fadeSlide}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="bg-surface-2 rounded-lg shadow-sm p-6"
    >
      {children}
    </motion.article>
  );
}
```

---

## 11. Asset Guidelines  
- **Icons:** Lucide 24×24 px, stroke 1.5.  
- **Images:** Optimised SVG/PNG ≤ 200 KB.  
- **Naming:** kebab-case; campaign images prefixed `campaign-`.

---

## 12. Appendix – Figma Tokens → Tailwind  

| Figma | Tailwind Class | Token |
|-------|----------------|-------|
| `$primary-500` | `bg-primary` | `--color-primary` |
| `$radius-lg` | `rounded-lg` | `--radius-lg` |
| `$shadow-sm` | `shadow-sm` | — |

---

*End of Guide*
