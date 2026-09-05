# Dashboard Typography, Spacing & Design System Specification

> **Migration & Implementation Guide for AI Coding Agents & Developers**  
> Use this document to migrate or standardize any web application dashboard to match the exact font sizes, hierarchy, spacing, density, and theme aesthetics of the **M.Div Softsolutions Executive Dashboard**.

---

## 1. Executive Summary & Design Philosophy

The aesthetic of this dashboard is characterized by **high information density, crisp contrast, tabular alignment, and zero-shift layout stability**.

Key principles:
1. **Compact Type Scale**: Rather than standard loose web typography (`text-base`, `text-lg` for everything), the primary workhorse is `text-xs` (12px) paired with micro-labels (`text-[10px]`, `text-[11px]`). This gives a dense, enterprise SaaS feel.
2. **Dual-Font System**:
   - **Headings & Brand**: `Space Grotesk` (weights 600, 700) with subtle negative letter-spacing (`tracking-tight` / `-0.02em`).
   - **Body & Data UI**: `Inter` (weights 400, 500, 600, 700) for crystal-clear readability at compact sizes.
3. **Tabular Numeric Figures (`tabular-nums` / `font-mono`)**: All monetary values, counters, invoice IDs, percentages, and progress metrics use fixed-width figures to prevent horizontal jitter during real-time data updates.
4. **Slate / Neutral Palette with Slate Blue Dark Mode**: Light mode uses clean `#F8FAFC` / `#FFFFFF` with `#E5E7EB` borders. Dark mode uses deep slate `#0F172A` / `#1E293B` surfaces with `#334155` borders.
5. **High-Contrast Monochrome Primary Actions**: Primary buttons invert between dark and light mode (`bg-neutral-900 text-white` in light, `bg-white text-neutral-900` in dark).

---

## 2. Complete Font Size Hierarchy & Usage Matrix

| Font Size Token | Exact Size (px / rem) | Font Family | Default Weight | Letter Spacing (Tracking) | Primary Use Cases | Tailwind Class Pattern |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Micro Badge / Tag** | `9px` / `0.5625rem` | `font-sans` | `font-bold` (700) | `uppercase tracking-wider` | Pinned indicators, super-compact role tags | `text-[9px] font-bold uppercase tracking-wider` |
| **Status Pill / Meta** | `10px` / `0.625rem` | `font-sans` / `font-mono` | `font-bold` (700) or `font-semibold` (600) | `uppercase tracking-wider` | Status badges (`Active`, `Paid`, `Draft`), column count counters, breadcrumbs, timestamp meta | `text-[10px] font-bold uppercase tracking-wider` |
| **Category & KPI Label** | `11px` / `0.6875rem` | `font-sans` | `font-bold` (700) | `uppercase tracking-wider` | KPI card top labels, small helper captions, user email below name | `text-[11px] font-bold text-neutral-400 uppercase tracking-wider` |
| **Primary UI Workhorse** | `12px` / `0.75rem` (`text-xs`) | `font-sans` | `font-medium` (500) to `font-bold` (700) | `normal` | **Table cells (`td`), table headers (`th`), inputs, selects, buttons, form labels, sidebar links, descriptions** | `text-xs font-medium` / `text-xs font-semibold` / `text-xs font-bold` |
| **Section & Widget Title** | `14px` / `0.875rem` (`text-sm`) | `font-heading` | `font-bold` (700) | `tracking-tight` (`-0.02em`) | Widget headers, project card titles, table summary title, dialog prompt title, user profile display name | `font-heading text-sm font-bold text-neutral-900 dark:text-white` |
| **Modal / Drawer Title** | `16px` / `1.0rem` (`text-base`) | `font-heading` | `font-bold` (700) | `tracking-tight` | Slide-over drawer header, full modal title | `font-heading text-base font-bold text-neutral-900 dark:text-white` |
| **Metric Value (Big KPI)** | `24px` / `1.5rem` (`text-2xl`) | `font-mono` / `nums` | `font-extrabold` (800) | `normal` / tabular | Financial totals, revenue numbers, open task counters, completion rates | `text-2xl font-extrabold font-mono nums text-neutral-900 dark:text-white` |
| **Page Primary Title (H1)**| `24px` - `30px` (`text-2xl lg:text-3xl`) | `font-heading` | `font-extrabold` (800) | `tracking-tight` | Dashboard executive command center title, top-level page header | `font-heading text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white` |

---

## 3. Font Families & Next.js / CSS Setup

### 3.1 Next.js `layout.tsx` Font Configuration
```tsx
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 dark:bg-[#0F172A] dark:text-slate-100 font-sans antialiased selection:bg-neutral-900 dark:selection:bg-white dark:selection:text-neutral-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
```

### 3.2 Tailwind CSS Configuration (`tailwind.config.ts`)
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['var(--font-heading)', 'Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          subtle: 'var(--background-subtle)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: {
          DEFAULT: 'var(--border)',
          light: '#E5E7EB',
          dark: '#334155',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
```

### 3.3 Core CSS Rules & Variables (`globals.css`)
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: #F8FAFC;
    --background-subtle: #F1F5F9;
    --card: #FFFFFF;
    --card-foreground: #0F172A;
    --border: #E5E7EB;
    --input: #E5E7EB;
    --foreground: #0F172A;
    --muted: #F8FAFC;
    --muted-foreground: #64748B;
    --radius: 0.5rem; /* 8px */
  }

  .dark,
  [data-theme="dark"] {
    --background: #0F172A;
    --background-subtle: #1E293B;
    --card: #1E293B;
    --card-foreground: #F8FAFC;
    --border: #334155;
    --input: #334155;
    --foreground: #F8FAFC;
    --muted: #1E293B;
    --muted-foreground: #94A3B8;
  }

  html {
    scrollbar-gutter: stable;
    overflow-y: scroll;
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    /* Tabular numeric alignment prevents jumping numbers in stats/currency */
    font-feature-settings: 'tnum' on, 'cv05' on, 'cv11' on;
    font-variant-numeric: tabular-nums;
  }

  h1, h2, h3, h4, h5, h6, .font-heading {
    font-family: var(--font-heading);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
}

/* Tabular number helper utility */
.nums {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' on;
}
```

---

## 4. Spacing System, Dimensions & Paddings

### 4.1 Global Layout Spacing
| Container | Class | Description |
| :--- | :--- | :--- |
| **Main Page Padding** | `p-4 sm:p-6 lg:p-8` | Outer padding around the entire dashboard view |
| **Vertical Stack Gap** | `space-y-6` | Standard spacing between page sections, banners, grids |
| **Top Navbar** | `h-16 shrink-0 px-4 sm:px-6 lg:px-8` | Fixed 64px sticky bar with backdrop blur |
| **Sidebar Expanded** | `w-64` (256px) | Standard sidebar width with `p-3` or `px-3` |
| **Sidebar Collapsed** | `w-16` or `w-[68px]` | Icon-only collapsed mode |
| **Standard Card Grid** | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` | KPI cards grid |
| **Main + Aside Split** | `grid grid-cols-1 lg:grid-cols-3 gap-6` | 2-col main feed (`lg:col-span-2`) + 1-col widgets |

### 4.2 Card & Container Paddings
- **KPI Summary Cards**: `p-5 min-h-[116px] rounded-lg`
- **Standard Content Cards / Table Containers**: `p-4` or `p-5 rounded-lg`
- **Executive Welcome Banner**: `p-6 rounded-lg`
- **Empty States**: `p-10` or `p-12 rounded-lg text-center space-y-4`
- **Modal Dialog Box**: `p-6 rounded-xl sm:max-w-md space-y-4`
- **Slide-over Drawer Body**: `p-6 space-y-4`

### 4.3 Control Dimensions & Radiuses
- **Primary / Secondary Buttons**: `px-4 py-2 rounded-md text-xs font-semibold` or `font-bold`
- **Quick Action / Header Buttons**: `px-3.5 py-1.5 rounded-md text-xs font-bold`
- **Table / Row Action Icon Buttons**: `p-1.5 rounded` with `w-4 h-4` or `w-3.5 h-3.5` icons
- **Form Inputs & Select Dropdowns**: `px-3 py-2 rounded-md text-xs font-medium`
- **Filter Bar Search Input**: `pl-9 pr-4 py-2 rounded-md text-xs font-medium`
- **Status Pills / Badges**: `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider`

---

## 5. Color Tokens & Dark Mode Mapping

| Element | Light Mode Class | Dark Mode Class | Description |
| :--- | :--- | :--- | :--- |
| **Page Background** | `bg-[#F8FAFC]` | `dark:bg-[#0F172A]` | Clean slate background |
| **Card / Surface** | `bg-white` | `dark:bg-[#1E293B]` | Elevated card surface |
| **Card Border** | `border-neutral-200` | `dark:border-[#334155]` | Subtle 1px boundary |
| **Subtle Inner Well** | `bg-neutral-50` / `bg-neutral-100` | `dark:bg-[#0F172A]` | Table headers, icon wells, input backgrounds |
| **Primary Text** | `text-neutral-900` | `dark:text-white` | High-contrast main headings & active items |
| **Secondary Text** | `text-neutral-700` | `dark:text-neutral-300` | Table cell data, card descriptions, labels |
| **Muted / Hint Text** | `text-neutral-500` | `dark:text-neutral-400` | Timestamps, secondary subtitles, meta |
| **Primary Action Button**| `bg-neutral-900 text-white hover:bg-neutral-800` | `dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100` | Inverted monochrome CTA |
| **Secondary Action Button**| `bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100` | `dark:bg-[#0F172A] dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800` | Muted outline CTA |

### Status Badges Color Palette (10px uppercase)
- **Active / Success**: `bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20`
- **Pending / Warning**: `bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20`
- **Overdue / Danger**: `bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20`
- **Review / In Progress**: `bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20`
- **Neutral / Draft**: `bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]`

---

## 6. Copy-Paste Component Patterns

### 6.1 KPI Summary Card
```tsx
export function KpiCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="min-h-[116px] p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{title}</span>
        <div className="w-8 h-8 shrink-0 rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="mt-1">
        <div className="h-8 flex items-center">
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono nums">{value}</span>
        </div>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1 h-4">
          <span>{subtitle}</span>
        </p>
      </div>
    </div>
  );
}
```

### 6.2 Executive Welcome Banner
```tsx
export function WelcomeBanner({ title, subtitle, date }: { title: string; subtitle: string; date: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm relative overflow-hidden">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-neutral-100 dark:bg-[#334155] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] uppercase tracking-wider">
            Live Operations
          </span>
          <span className="text-xs text-neutral-400">{date}</span>
        </div>
        <h1 className="font-heading text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-white dark:bg-[#0F172A] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 shadow-sm transition-all">
          Secondary Action
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 text-xs font-bold shadow-sm transition-all">
          Primary Action
        </button>
      </div>
    </div>
  );
}
```

### 6.3 Data Table
```tsx
export function DataTable() {
  return (
    <div className="rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-[#0F172A] text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-[#334155]">
            <tr>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Entity</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Details</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#334155] font-medium">
            <tr className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors">
              <td className="px-5 py-4 font-bold text-neutral-900 dark:text-white">Acme Corp</td>
              <td className="px-5 py-4 text-neutral-600 dark:text-neutral-300">Enterprise CRM Sprint</td>
              <td className="px-5 py-4 font-bold font-mono text-neutral-900 dark:text-white nums">$14,500.00</td>
              <td className="px-5 py-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
                  Active
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <button className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### 6.4 Form Field Group
```tsx
<div className="space-y-1">
  <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
    Project Title *
  </label>
  <input
    type="text"
    placeholder="e.g. Next.js SaaS Modernization"
    className="w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
  />
</div>
```

---

## 7. Migration Checklist for Another Project

Follow these steps when moving another codebase to this typography and spacing theme:

1. [ ] **Install Fonts**: Add `Inter` (weights 400-700) and `Space Grotesk` (weights 600-700). Assign `--font-sans` and `--font-heading`.
2. [ ] **Configure Numerical Tabular Support**: Apply `font-feature-settings: 'tnum' on; font-variant-numeric: tabular-nums;` to `body` and numeric classes.
3. [ ] **Replace Loose Text Sizes**:
   - Replace body/table cell `text-base` or `text-sm` with `text-xs font-medium`.
   - Replace table headers with `text-xs font-bold uppercase tracking-wider`.
   - Replace form labels with `text-xs font-semibold`.
   - Replace inputs/selects with `text-xs px-3 py-2 rounded-md`.
   - Replace status badges with `text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded`.
   - Replace KPI card values with `text-2xl font-extrabold font-mono nums`.
   - Replace KPI titles with `text-[11px] font-bold text-neutral-400 uppercase tracking-wider`.
4. [ ] **Harmonize Spacing**:
   - Set outer layout padding to `p-4 sm:p-6 lg:p-8`.
   - Standardize card padding to `p-4` or `p-5 rounded-lg`.
   - Set header height to `h-16 shrink-0`.
5. [ ] **Apply Dark Mode Colors**:
   - Background: `#0F172A`
   - Card Surface: `#1E293B`
   - Border: `#334155`
6. [ ] **Ensure Button Inversion**:
   - Primary: `bg-neutral-900 text-white dark:bg-white dark:text-neutral-900`
