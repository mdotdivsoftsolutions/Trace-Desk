'use client';

import React, { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
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
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const emptySubscribe = () => () => {};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  isLoading = false,
  onConfirm,
  onCancel,
  onClose,
}: ConfirmDialogProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isOpen || !mounted) return null;
  const handleDismiss = onCancel || onClose || (() => {});

  const dialogContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleDismiss} />
        <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] p-6 text-left shadow-2xl transition-all sm:w-full sm:max-w-md space-y-4">
          <div className="flex items-start gap-4">
            <div className={cn('p-2.5 rounded-lg flex-shrink-0', variant === 'danger' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600')}>
              {variant === 'danger' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white">{title}</h3>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">{description}</div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={handleDismiss}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer',
                variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900'
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

  return createPortal(dialogContent, document.body);
}

export default ConfirmDialog;
