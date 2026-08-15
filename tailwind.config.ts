import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        heading: ['var(--font-heading)', 'Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          subtle: 'var(--background-subtle)',
          light: '#FFFFFF',
          dark: '#0A0A0A',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          muted: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        border: {
          DEFAULT: 'var(--border)',
          light: '#E5E7EB',
          dark: '#2A2A2A',
        },
        input: 'var(--input)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        placeholder: 'var(--placeholder)',
        brand: {
          light: '#4F46E5',
          dark: '#6366F1',
          DEFAULT: 'var(--primary)',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1A1A1A',
          DEFAULT: 'var(--card)',
        },
        semantic: {
          success: 'var(--success)',
          warning: 'var(--warning)',
          danger: 'var(--destructive)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        dataviz: [
          '#4F46E5',
          '#06B6D4',
          '#F59E0B',
          '#EC4899',
          '#10B981',
          '#8B5CF6',
          '#EF4444',
          '#64748B',
        ],
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        md: '6px',
        lg: 'var(--radius, 8px)',
        xl: 'var(--radius, 8px)',
        '2xl': 'var(--radius, 8px)',
        '3xl': 'var(--radius, 8px)',
      },
    },
  },
  plugins: [],
};

export default config;
