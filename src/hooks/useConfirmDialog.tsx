'use client';

import React, { useState, useCallback, createContext, useContext } from 'react';
import { ConfirmDialog, ConfirmDialogProps, ConfirmDialogVariant } from '@/components/common/ConfirmDialog';

export interface ConfirmOptions {
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve?: (value: boolean) => void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    options: { title: '', description: '', confirmText: 'Confirm', cancelText: 'Cancel', variant: 'danger' },
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setDialogState({ isOpen: true, options, resolve, isLoading: false });
    });
  }, []);

  const handleClose = useCallback(() => {
    if (dialogState.resolve) dialogState.resolve(false);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, [dialogState]);

  const handleConfirm = useCallback(() => {
    if (dialogState.resolve) dialogState.resolve(true);
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  }, [dialogState]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        title={dialogState.options.title}
        description={dialogState.options.description}
        confirmText={dialogState.options.confirmText}
        cancelText={dialogState.options.cancelText}
        variant={dialogState.options.variant}
        isLoading={dialogState.isLoading}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirmDialog() {
  const context = useContext(ConfirmContext);
  const [localState, setLocalState] = useState<{ isOpen: boolean; options: ConfirmOptions; resolve?: (value: boolean) => void; isLoading?: boolean }>({
    isOpen: false, options: { title: '', description: '' },
  });

  const localConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setLocalState({ isOpen: true, options, resolve, isLoading: false });
    });
  }, []);

  const handleLocalClose = useCallback(() => {
    if (localState.resolve) localState.resolve(false);
    setLocalState((prev) => ({ ...prev, isOpen: false }));
  }, [localState]);

  const handleLocalConfirm = useCallback(() => {
    if (localState.resolve) localState.resolve(true);
    setLocalState((prev) => ({ ...prev, isOpen: false }));
  }, [localState]);

  const ConfirmDialogComponent = useCallback(() => (
    <ConfirmDialog
      isOpen={localState.isOpen}
      title={localState.options.title}
      description={localState.options.description}
      confirmText={localState.options.confirmText}
      cancelText={localState.options.cancelText}
      variant={localState.options.variant}
      isLoading={localState.isLoading}
      onConfirm={handleLocalConfirm}
      onClose={handleLocalClose}
    />
  ), [localState, handleLocalConfirm, handleLocalClose]);

  if (context) return { confirm: context.confirm, ConfirmDialogComponent: () => null };
  return { confirm: localConfirm, ConfirmDialogComponent };
}

export default useConfirmDialog;
