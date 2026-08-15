'use client';

import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconContainer: 'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] border border-rose-500/20',
      confirmButton:
        'bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-md shadow-rose-600/25 focus:ring-rose-500',
    },
    warning: {
      icon: AlertCircle,
      iconContainer: 'bg-neutral-100 dark:bg-[#334155] text-neutral-900 dark:text-white border border-neutral-200 dark:border-[#334155] border border-amber-500/20',
      confirmButton:
        'bg-amber-600 hover:bg-amber-700 active:scale-95 text-white shadow-md shadow-amber-600/25 focus:ring-amber-500',
    },
    info: {
      icon: Info,
      iconContainer: 'bg-neutral-100 dark:bg-[#252B37] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#2D333F] border border-neutral-200 dark:border-[#2D333F]',
      confirmButton:
        'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 active:scale-95 shadow-sm focus:ring-neutral-400 dark:focus:ring-neutral-500',
    },
  }[variant];

  const Icon = variantConfig.icon;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-lg bg-white dark:bg-[#1C2029] border border-neutral-200 dark:border-[#2D333F] shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          {/* Header Area */}
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                variantConfig.iconContainer
              )}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white leading-tight">
                {title}
              </h3>
              <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {description}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute right-4 top-4 p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
              title="Close Dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100 dark:border-[#2D333F]/60">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111318] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#1C2029] disabled:opacity-50',
                variantConfig.confirmButton
              )}
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
