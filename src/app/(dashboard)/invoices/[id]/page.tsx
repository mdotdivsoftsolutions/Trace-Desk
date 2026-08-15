'use client';

import React, { useState, use } from 'react';
import { useInvoice, useInvoicePayments } from '@/hooks/useInvoices';
import { useSettings } from '@/hooks/useSettings';
import { InvoiceHeaderActions } from '@/components/modules/invoices/detail/InvoiceHeaderActions';
import { InvoiceDocumentPreview } from '@/components/modules/invoices/detail/InvoiceDocumentPreview';
import { InvoicePaymentHistory } from '@/components/modules/invoices/detail/InvoicePaymentHistory';
import { RecordPaymentDrawer } from '@/components/modules/payments/RecordPaymentDrawer';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);

  const { data: invoice, isLoading: isInvoiceLoading } = useInvoice(id);
  const { data: payments = [] } = useInvoicePayments(id);
  const { data: settings } = useSettings();

  if (isInvoiceLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-500 mt-2">Loading invoice document...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-12 text-center text-neutral-500">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">Invoice Not Found</h2>
        <p className="text-xs mt-1">This invoice may have been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InvoiceHeaderActions
        invoice={invoice}
        onRecordPayment={() => setIsPaymentDrawerOpen(true)}
      />

      <InvoiceDocumentPreview invoice={invoice} settings={settings} />

      <InvoicePaymentHistory payments={payments} />

      <RecordPaymentDrawer
        isOpen={isPaymentDrawerOpen}
        onClose={() => setIsPaymentDrawerOpen(false)}
        invoice={invoice}
      />
    </div>
  );
}
