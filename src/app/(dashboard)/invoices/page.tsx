'use client';

import React, { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { useDebounce } from '@/hooks/useDebounce';
import { InvoiceType } from '@/types';
import { InvoiceKpiCards } from '@/components/modules/invoices/list/InvoiceKpiCards';
import { InvoiceFilterBar } from '@/components/modules/invoices/list/InvoiceFilterBar';
import { InvoiceTable } from '@/components/modules/invoices/list/InvoiceTable';
import { Pagination } from '@/components/common/pagination';
import { RecordPaymentDrawer } from '@/components/modules/payments/RecordPaymentDrawer';

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceType | null>(null);

  const { data, isLoading, isFetching } = useInvoices({
    search: debouncedSearch || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    limit,
  });

  const invoices = data?.items || [];
  const totalBilled = invoices.reduce((sum: number, inv: InvoiceType) => sum + inv.totalAmount, 0);
  const pendingReceivables = invoices.reduce((sum: number, inv: InvoiceType) => sum + inv.balanceDue, 0);
  const totalCollected = totalBilled - pendingReceivables;
  const overdueCount = invoices.filter((i: InvoiceType) => i.status === 'overdue').length;

  const isTableLoading = isLoading || isFetching || search !== debouncedSearch;

  return (
    <div className="space-y-6">
      <InvoiceFilterBar
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(val) => { setStatusFilter(val); setPage(1); }}
      />

      <InvoiceKpiCards
        totalBilled={totalBilled}
        totalCollected={totalCollected}
        pendingReceivables={pendingReceivables}
        overdueCount={overdueCount}
      />

      <InvoiceTable
        invoices={invoices}
        isLoading={isTableLoading}
        onRecordPayment={(inv) => setPaymentInvoice(inv)}
      />

      {data?.pagination && data.pagination.totalPages > 1 && (
        <Pagination
          pagination={data.pagination}
          onPageChange={setPage}
        />
      )}

      <RecordPaymentDrawer
        isOpen={!!paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        invoice={paymentInvoice}
      />
    </div>
  );
}
