import React from 'react';
import Image from 'next/image';
import { Invoice, Settings, Client, Project } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import SafeHTML from '@/components/common/SafeHTML';

interface InvoiceDocumentPreviewProps {
  invoice: Invoice;
  settings?: Settings;
}

export function InvoiceDocumentPreview({ invoice, settings }: InvoiceDocumentPreviewProps) {
  const client = typeof invoice.clientId === 'object' ? (invoice.clientId as Client) : null;
  const project = typeof invoice.projectId === 'object' ? (invoice.projectId as Project) : null;
  const bank = settings?.bankDetails || settings?.bankAccounts?.find((a) => a.isPrimary) || settings?.bankAccounts?.[0];
  const logoSrc = settings?.logoUrl || '/logo.png';

  return (
    <div className="p-8 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-neutral-200 dark:border-[#334155] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white p-0.5 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold shadow-sm overflow-hidden">
              <Image
                src={logoSrc}
                alt={settings?.agencyName || 'M.Div Softsolutions'}
                width={30}
                height={30}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-heading text-lg font-extrabold text-neutral-900 dark:text-white">
              {settings?.agencyName || 'M.Div Softsolutions'}
            </span>
          </div>
          <div className="text-xs text-neutral-500 mt-2 space-y-0.5">
            {settings?.taxNumber && <div>GSTIN: <span className="font-mono">{settings.taxNumber}</span></div>}
            {settings?.agencyEmail && <div>{settings.agencyEmail}</div>}
            {settings?.agencyPhone && <div>{settings.agencyPhone}</div>}
          </div>
        </div>

        <div className="text-left sm:text-right space-y-1">
          <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">{invoice.invoiceNumber}</span>
          <div className="text-xs text-neutral-500">Issued: <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(invoice.issueDate)}</span></div>
          <div className="text-xs text-neutral-500">Due: <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(invoice.dueDate)}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Billed To:</span>
          <div className="font-bold text-sm text-neutral-900 dark:text-white">
            {client?.companyName || client?.company || client?.name || 'Client'}
          </div>
          {(client?.companyName || client?.company) && client?.name && (client?.companyName || client?.company) !== client?.name && (
            <div className="text-neutral-500">Attn: {client.name}</div>
          )}
          {client?.address && <div className="text-neutral-500 mt-0.5">{client.address}</div>}
          {client?.taxId && <div className="text-neutral-500 mt-0.5">Tax ID: <span className="font-mono">{client.taxId}</span></div>}
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Project Workspace:</span>
          <div className="font-bold text-neutral-900 dark:text-white">{project?.title || 'Project'}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-[#0F172A] border-y border-neutral-200 dark:border-[#334155] text-neutral-500">
            <tr>
              <th className="px-4 py-2.5 font-bold uppercase">Item Description</th>
              <th className="px-4 py-2.5 font-bold uppercase text-center">Qty</th>
              <th className="px-4 py-2.5 font-bold uppercase text-right">Rate</th>
              <th className="px-4 py-2.5 font-bold uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#334155]">
            {invoice.items.map((it, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white">{it.description}</td>
                <td className="px-4 py-3 text-center text-neutral-500">{it.quantity}</td>
                <td className="px-4 py-3 text-right font-mono text-neutral-500">{formatCurrency(it.rate)}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-neutral-900 dark:text-white">{formatCurrency(it.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-neutral-200 dark:border-[#334155]">
        <div className="space-y-3 text-xs max-w-sm">
          {bank?.accountNumber && (
            <div className="p-3 rounded bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] space-y-1">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Bank Remittance:</span>
              <div>A/C Name: <span className="font-semibold text-neutral-900 dark:text-white">{bank.accountName}</span></div>
              <div>A/C Number: <span className="font-mono font-bold text-neutral-900 dark:text-white">{bank.accountNumber}</span></div>
              <div>IFSC: <span className="font-mono text-neutral-900 dark:text-white">{bank.ifscCode}</span> ({bank.bankName})</div>
              {bank.upiId && <div>UPI ID: <span className="font-mono text-neutral-900 dark:text-white">{bank.upiId}</span></div>}
            </div>
          )}
          {invoice.notes && <SafeHTML html={invoice.notes} className="text-neutral-500 italic" />}
        </div>

        <div className="space-y-2 text-xs w-full sm:w-64">
          <div className="flex justify-between text-neutral-500"><span>Subtotal:</span><span className="font-mono">{formatCurrency(invoice.subtotal)}</span></div>
          {invoice.taxAmount > 0 && <div className="flex justify-between text-neutral-500"><span>Tax ({invoice.taxRate}%):</span><span className="font-mono">{formatCurrency(invoice.taxAmount)}</span></div>}
          {invoice.discount > 0 && <div className="flex justify-between text-neutral-500"><span>Discount:</span><span className="font-mono">-{formatCurrency(invoice.discount)}</span></div>}
          <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-[#334155]"><span>Total:</span><span className="font-mono">{formatCurrency(invoice.totalAmount)}</span></div>
          <div className="flex justify-between font-bold text-xs text-neutral-700 dark:text-neutral-300"><span>Balance Due:</span><span className="font-mono">{formatCurrency(invoice.balanceDue)}</span></div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDocumentPreview;
