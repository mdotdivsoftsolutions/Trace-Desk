import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 2,
    }).format(amount || 0);
  } catch (e) {
    return `${currency || '$'} ${(amount || 0).toLocaleString()}`;
  }
}

export function formatDate(dateString?: string | Date | null): string {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDeadline(dateString?: string | Date | null): {
  text: string;
  isOverdue: boolean;
  isUrgent: boolean;
} {
  if (!dateString) return { text: 'No date', isOverdue: false, isUrgent: false };
  const target = new Date(dateString);
  const now = new Date();
  const diffHours = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60));

  if (diffHours < 0) {
    const daysAgo = Math.abs(Math.round(diffHours / 24));
    return {
      text: daysAgo === 0 ? 'Overdue today' : `Overdue by ${daysAgo}d`,
      isOverdue: true,
      isUrgent: true,
    };
  }

  if (diffHours <= 48) {
    return {
      text: diffHours < 24 ? `Due in ${diffHours}h` : `Due tomorrow`,
      isOverdue: false,
      isUrgent: true,
    };
  }

  const daysLeft = Math.round(diffHours / 24);
  return {
    text: `Due in ${daysLeft}d`,
    isOverdue: false,
    isUrgent: false,
  };
}
