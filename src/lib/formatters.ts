/**
 * Currency and locale formatters supporting Indian Numbering System (Lakhs/Crores)
 * and standard international currencies.
 */

export function formatCurrency(
  amount: number,
  currency: string = 'INR'
): string {
  const code = (currency || 'INR').toUpperCase();
  const value = amount || 0;

  try {
    switch (code) {
      case 'INR':
        // Indian numbering format: e.g. ₹1,50,000 or ₹12,34,567.89
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 2,
        }).format(value);

      case 'USD':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 2,
        }).format(value);

      case 'EUR':
        return new Intl.NumberFormat('en-IE', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 2,
        }).format(value);

      case 'GBP':
        return new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP',
          maximumFractionDigits: 2,
        }).format(value);

      case 'AED':
        return new Intl.NumberFormat('en-AE', {
          style: 'currency',
          currency: 'AED',
          maximumFractionDigits: 2,
        }).format(value);

      default:
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: code,
          maximumFractionDigits: 2,
        }).format(value);
    }
  } catch (e) {
    const symbolMap: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'AED',
    };
    const sym = symbolMap[code] || code;
    return `${sym} ${value.toLocaleString('en-IN')}`;
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
