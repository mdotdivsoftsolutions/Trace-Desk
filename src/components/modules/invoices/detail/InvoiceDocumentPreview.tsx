import React from 'react';
import Image from 'next/image';
import { Invoice, Settings, Client, Project } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import SafeHTML from '@/components/common/SafeHTML';

interface InvoiceDocumentPreviewProps {
  invoice: Invoice;
  settings?: Settings;
}

const statusBadgeStyles: Record<string, string> = {
  draft: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700',
  sent: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  partially_paid: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  paid: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  overdue: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  cancelled: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
};

export function InvoiceDocumentPreview({ invoice, settings }: InvoiceDocumentPreviewProps) {
  const client = typeof invoice.clientId === 'object' ? (invoice.clientId as Client) : null;
  const project = typeof invoice.projectId === 'object' ? (invoice.projectId as Project) : null;
  const bank = settings?.bankDetails || settings?.bankAccounts?.find((a) => a.isPrimary) || settings?.bankAccounts?.[0];
  const logoSrc = settings?.logoUrl || '/logo.png';
  const currency = invoice.currency || settings?.defaultCurrency || 'INR';

  // Support both discountAmount and discount fields from MongoDB
  const discount = Number(invoice.discountAmount ?? invoice.discount ?? 0);
  const taxAmount = Number(invoice.taxAmount ?? 0);
  const paidAmount = Number(invoice.paidAmount ?? invoice.amountPaid ?? 0);

  return (
    <div
      id="invoice-document-preview"
      className="p-8 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-8 print:border-none print:shadow-none print:p-0 print:bg-white print:text-neutral-900 print:max-w-full"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-neutral-200 dark:border-[#334155] print:border-neutral-300 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white p-0.5 border border-neutral-200 dark:border-neutral-700 print:border-neutral-300 flex items-center justify-center font-bold shadow-sm overflow-hidden">
              <Image
                src={logoSrc}
                alt={settings?.agencyName || 'M.Div Softsolutions'}
                width={30}
                height={30}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-heading text-lg font-extrabold text-neutral-900 dark:text-white print:text-neutral-900">
              {settings?.agencyName || 'M.Div Softsolutions'}
            </span>
          </div>
          <div className="text-xs text-neutral-500 print:text-neutral-600 mt-2 space-y-0.5">
            {settings?.agencyAddress && <div>{settings.agencyAddress}</div>}
            {(settings?.taxNumber || settings?.gstinOrTaxId) && (
              <div>GSTIN / Tax ID: <span className="font-mono">{settings.taxNumber || settings.gstinOrTaxId}</span></div>
            )}
            {settings?.agencyEmail && <div>{settings.agencyEmail}</div>}
            {settings?.agencyPhone && <div>{settings.agencyPhone}</div>}
          </div>
        </div>

        {/* Clean right-aligned metadata table for flawless alignment */}
        <div className="text-left sm:text-right min-w-[210px]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 print:text-neutral-500">Tax Invoice</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white print:text-neutral-900 mb-2">{invoice.invoiceNumber}</div>

          <table className="sm:ml-auto border-separate border-spacing-y-1 text-xs">
            <tbody>
              <tr>
                <td className="pr-3 text-right text-neutral-500 print:text-neutral-600 font-medium">Issue Date:</td>
                <td className="text-right font-bold text-neutral-800 dark:text-neutral-200 print:text-neutral-900 whitespace-nowrap">{formatDate(invoice.issueDate)}</td>
              </tr>
              <tr>
                <td className="pr-3 text-right text-neutral-500 print:text-neutral-600 font-medium">Due Date:</td>
                <td className="text-right font-bold text-neutral-800 dark:text-neutral-200 print:text-neutral-900 whitespace-nowrap">{formatDate(invoice.dueDate)}</td>
              </tr>
              <tr>
                <td className="pr-3 text-right text-neutral-500 print:text-neutral-600 font-medium">Status:</td>
                <td className="text-right">
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider inline-block', statusBadgeStyles[invoice.status] || 'bg-neutral-500/10 text-neutral-400')}>
                    {invoice.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div className="p-3.5 rounded-md bg-neutral-50 dark:bg-[#0F172A] print:bg-neutral-50 border border-neutral-200 dark:border-[#334155] print:border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-400 print:text-neutral-500 block mb-1">Billed To:</span>
          <div className="font-bold text-sm text-neutral-900 dark:text-white print:text-neutral-900">
            {client?.companyName || client?.company || client?.name || 'Client'}
          </div>
          {(client?.companyName || client?.company) && client?.name && (client?.companyName || client?.company) !== client?.name && (
            <div className="text-neutral-500 print:text-neutral-600">Attn: {client.name}</div>
          )}
          {client?.address && <div className="text-neutral-500 print:text-neutral-600 mt-0.5">{client.address}</div>}
          {client?.email && <div className="text-neutral-500 print:text-neutral-600 mt-0.5">{client.email}</div>}
          {client?.taxId && <div className="text-neutral-500 print:text-neutral-600 mt-0.5">Tax ID: <span className="font-mono">{client.taxId}</span></div>}
        </div>
        <div className="p-3.5 rounded-md bg-neutral-50 dark:bg-[#0F172A] print:bg-neutral-50 border border-neutral-200 dark:border-[#334155] print:border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-400 print:text-neutral-500 block mb-1">Project & Terms:</span>
          <div className="font-bold text-neutral-900 dark:text-white print:text-neutral-900">{project?.title || 'General Services'}</div>
          <div className="text-neutral-500 print:text-neutral-600 mt-1">Currency: <span className="font-semibold text-neutral-800 dark:text-neutral-200 print:text-neutral-900">{currency}</span></div>
          {invoice.paymentTerms && <div className="text-neutral-500 print:text-neutral-600 mt-0.5">Terms: {invoice.paymentTerms}</div>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-[#0F172A] print:bg-neutral-100 border-y border-neutral-200 dark:border-[#334155] print:border-neutral-300 text-neutral-500 print:text-neutral-700">
            <tr>
              <th className="px-4 py-2.5 font-bold uppercase">Item Description</th>
              <th className="px-4 py-2.5 font-bold uppercase text-center">Qty</th>
              <th className="px-4 py-2.5 font-bold uppercase text-right">Rate</th>
              <th className="px-4 py-2.5 font-bold uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-[#334155] print:divide-neutral-200">
            {invoice.items.map((it, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-white print:text-neutral-900">{it.description}</td>
                <td className="px-4 py-3 text-center text-neutral-500 print:text-neutral-600">{it.quantity}</td>
                <td className="px-4 py-3 text-right font-mono text-neutral-500 print:text-neutral-600">{formatCurrency(it.rate, currency)}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-neutral-900 dark:text-white print:text-neutral-900">{formatCurrency(it.amount, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-neutral-200 dark:border-[#334155] print:border-neutral-300">
        <div className="space-y-3 text-xs max-w-sm">
          {bank?.accountNumber && (
            <div className="p-3 rounded bg-neutral-50 dark:bg-[#0F172A] print:bg-neutral-50 border border-neutral-200 dark:border-[#334155] print:border-neutral-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-neutral-400 print:text-neutral-500 block">Bank Remittance:</span>
              <div>A/C Name: <span className="font-semibold text-neutral-900 dark:text-white print:text-neutral-900">{bank.accountName}</span></div>
              <div>A/C Number: <span className="font-mono font-bold text-neutral-900 dark:text-white print:text-neutral-900">{bank.accountNumber}</span></div>
              <div>IFSC: <span className="font-mono text-neutral-900 dark:text-white print:text-neutral-900">{bank.ifscCode}</span> ({bank.bankName})</div>
              {bank.upiId && <div>UPI ID: <span className="font-mono text-neutral-900 dark:text-white print:text-neutral-900">{bank.upiId}</span></div>}
            </div>
          )}
          {invoice.notes && <SafeHTML html={invoice.notes} className="text-neutral-500 print:text-neutral-600 italic" />}
        </div>

        <div className="space-y-2 text-xs w-full sm:w-64">
          <div className="flex justify-between text-neutral-500 print:text-neutral-600"><span>Subtotal:</span><span className="font-mono">{formatCurrency(invoice.subtotal, currency)}</span></div>
          {taxAmount > 0 && <div className="flex justify-between text-neutral-500 print:text-neutral-600"><span>Tax ({invoice.taxRate || 0}%):</span><span className="font-mono">{formatCurrency(taxAmount, currency)}</span></div>}
          {discount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 print:text-emerald-700 font-semibold">
              <span>Discount:</span>
              <span className="font-mono">-{formatCurrency(discount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-sm text-neutral-900 dark:text-white print:text-neutral-900 pt-2 border-t border-neutral-200 dark:border-[#334155] print:border-neutral-300"><span>Total:</span><span className="font-mono">{formatCurrency(invoice.totalAmount, currency)}</span></div>
          {paidAmount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 print:text-emerald-700 font-semibold">
              <span>Paid:</span>
              <span className="font-mono">-{formatCurrency(paidAmount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-xs text-white bg-neutral-900 dark:bg-neutral-800 print:bg-neutral-900 print:text-white p-2.5 rounded shadow-sm">
            <span>Balance Due:</span>
            <span className="font-mono">{formatCurrency(invoice.balanceDue, currency)}</span>
          </div>
        </div>
      </div>

      {/* Authorized Signatory Section */}
      <div className="pt-8 border-t border-neutral-200 dark:border-[#334155] print:border-neutral-300 flex justify-between items-end">
        <div className="text-[10px] text-neutral-400 print:text-neutral-500 max-w-xs">
          Computer generated tax invoice. Questions? Contact {settings?.agencyEmail || 'support'}.
        </div>
        <div className="text-center w-48">
          <div className="h-10 border-b border-neutral-300 dark:border-neutral-600 print:border-neutral-400 mb-1" />
          <div className="text-[11px] font-bold text-neutral-900 dark:text-white print:text-neutral-900">Authorized Signatory</div>
          <div className="text-[10px] text-neutral-500 print:text-neutral-600">For {settings?.agencyName || 'M.Div Softsolutions'}</div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDocumentPreview;
