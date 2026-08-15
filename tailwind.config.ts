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
        brand: {
          light: '#4F46E5',
          dark: '#6366F1',
          DEFAULT: '#4F46E5',
        },
        background: {
          light: '#F8FAFC',
          dark: '#0B0F19',
          DEFAULT: '#F8FAFC',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#131A2A',
          DEFAULT: '#FFFFFF',
        },
        border: {
          light: '#E2E8F0',
          dark: '#232B3D',
          DEFAULT: '#E2E8F0',
        },
        semantic: {
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
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
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
        '3xl': '8px',
      },
    },
  },
  plugins: [],
};

export default config;
