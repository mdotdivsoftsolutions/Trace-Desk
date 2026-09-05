import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceType, SettingsType, ClientType, ProjectType } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface ExportInvoiceOptions {
  invoice: InvoiceType;
  settings?: SettingsType;
}

/**
 * Generates and triggers download of an official, high-resolution PDF invoice.
 * Renders an isolated, pristine white A4 template to avoid dark-mode bleeding
 * and responsive layout distortions.
 */
export async function downloadInvoicePDF({ invoice, settings }: ExportInvoiceOptions): Promise<void> {
  if (typeof window === 'undefined') return;

  const client = typeof invoice.clientId === 'object' ? (invoice.clientId as ClientType) : null;
  const project = typeof invoice.projectId === 'object' ? (invoice.projectId as ProjectType) : null;
  const bank = settings?.bankDetails || settings?.bankAccounts?.find((a) => a.isPrimary) || settings?.bankAccounts?.[0];
  const currency = invoice.currency || settings?.defaultCurrency || 'INR';

  const clientName = client?.companyName || client?.company || client?.name || 'Valued Client';
  const clientAttn = client?.companyName || client?.company ? client?.name : '';
  const agencyName = settings?.agencyName || 'M.Div Softsolutions';
  const logoUrl = settings?.logoUrl || '/logo.png';

  // Create an off-screen container styled strictly for A4 print/capture (800px width @ 96dpi standard)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-10000px';
  container.style.left = '-10000px';
  container.style.width = '800px';
  container.style.minHeight = '1120px'; // A4 minimum height
  container.style.backgroundColor = '#FFFFFF';
  container.style.color = '#111827';
  container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.padding = '44px 48px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-9999';

  // Build the invoice HTML structure
  container.innerHTML = `
    <div style="width: 100%; box-sizing: border-box; background: #ffffff; color: #111827; font-size: 13px; line-height: 1.5;">
      <!-- Header Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #E5E7EB; margin-bottom: 28px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <img src="${logoUrl}" alt="${agencyName}" style="height: 36px; width: auto; max-width: 140px; object-fit: contain;" crossorigin="anonymous" onerror="this.style.display='none'" />
            <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #0F172A;">${agencyName}</span>
          </div>
          <div style="font-size: 11px; color: #64748B; line-height: 1.6;">
            ${settings?.agencyAddress ? `<div>${settings.agencyAddress}</div>` : ''}
            ${settings?.taxNumber || settings?.gstinOrTaxId ? `<div><strong>GSTIN / Tax ID:</strong> <span style="font-family: monospace;">${settings.taxNumber || settings.gstinOrTaxId}</span></div>` : ''}
            ${settings?.agencyEmail ? `<div><strong>Email:</strong> ${settings.agencyEmail}</div>` : ''}
            ${settings?.agencyPhone ? `<div><strong>Phone:</strong> ${settings.agencyPhone}</div>` : ''}
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 22px; font-weight: 800; letter-spacing: -0.01em; color: #0F172A; text-transform: uppercase;">Tax Invoice</div>
          <div style="font-family: monospace; font-size: 15px; font-weight: 700; color: #4F46E5; margin-top: 4px;">${invoice.invoiceNumber}</div>
          <div style="margin-top: 8px; font-size: 11px; color: #64748B; line-height: 1.6;">
            <div><strong>Issue Date:</strong> <span style="color: #0F172A;">${formatDate(invoice.issueDate)}</span></div>
            <div><strong>Due Date:</strong> <span style="color: #0F172A;">${formatDate(invoice.dueDate)}</span></div>
            <div style="margin-top: 6px;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid ${
                invoice.status === 'paid' ? '#10B981; background: #ECFDF5; color: #065F46;' :
                invoice.status === 'partially_paid' ? '#F59E0B; background: #FFFBEB; color: #92400E;' :
                invoice.status === 'overdue' ? '#EF4444; background: #FEF2F2; color: #991B1B;' :
                '#94A3B8; background: #F8FAFC; color: #334155;'
              }">
                Status: ${invoice.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Billing Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px;">
        <div style="background: #F8FAFC; padding: 14px 16px; border-radius: 6px; border: 1px solid #E2E8F0;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 6px;">Billed To</div>
          <div style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 2px;">${clientName}</div>
          ${clientAttn && clientAttn !== clientName ? `<div style="font-size: 11px; color: #475569; margin-bottom: 2px;"><strong>Attn:</strong> ${clientAttn}</div>` : ''}
          ${client?.address ? `<div style="font-size: 11px; color: #475569; margin-bottom: 2px;">${client.address}</div>` : ''}
          ${client?.email ? `<div style="font-size: 11px; color: #475569; margin-bottom: 2px;">${client.email}</div>` : ''}
          ${client?.taxId ? `<div style="font-size: 11px; color: #475569; margin-top: 4px;"><strong>Tax ID / GSTIN:</strong> <span style="font-family: monospace;">${client.taxId}</span></div>` : ''}
        </div>

        <div style="background: #F8FAFC; padding: 14px 16px; border-radius: 6px; border: 1px solid #E2E8F0;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 6px;">Project & Billing Details</div>
          <div style="font-size: 13px; font-weight: 700; color: #0F172A; margin-bottom: 4px;">
            ${project?.title || 'General Professional Services'}
          </div>
          <div style="font-size: 11px; color: #475569; line-height: 1.6;">
            <div><strong>Currency:</strong> ${currency}</div>
            ${invoice.paymentTerms ? `<div><strong>Terms:</strong> ${invoice.paymentTerms}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Line Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px;">
        <thead>
          <tr style="background: #0F172A; color: #FFFFFF;">
            <th style="padding: 10px 14px; text-align: left; font-weight: 700; border-top-left-radius: 4px;">#</th>
            <th style="padding: 10px 14px; text-align: left; font-weight: 700;">Description</th>
            <th style="padding: 10px 14px; text-align: center; font-weight: 700;">Qty</th>
            <th style="padding: 10px 14px; text-align: right; font-weight: 700;">Rate</th>
            <th style="padding: 10px 14px; text-align: right; font-weight: 700; border-top-right-radius: 4px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item, index) => `
            <tr style="border-bottom: 1px solid #E2E8F0; background: ${index % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
              <td style="padding: 10px 14px; color: #64748B; font-weight: 600;">${index + 1}</td>
              <td style="padding: 10px 14px; color: #0F172A; font-weight: 600;">${item.description}</td>
              <td style="padding: 10px 14px; text-align: center; color: #475569;">${item.quantity}</td>
              <td style="padding: 10px 14px; text-align: right; font-family: monospace; color: #475569;">${formatCurrency(item.rate, currency)}</td>
              <td style="padding: 10px 14px; text-align: right; font-family: monospace; font-weight: 700; color: #0F172A;">${formatCurrency(item.amount, currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals & Payment Details Area -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 28px;">
        <!-- Left Column: Bank / Remittance & Notes -->
        <div style="flex: 1; max-width: 420px;">
          ${bank?.accountNumber ? `
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px 14px; margin-bottom: 14px; font-size: 11px;">
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #4F46E5; margin-bottom: 6px;">Bank Remittance Details</div>
              <div style="color: #334155; line-height: 1.6;">
                <div><strong>Account Name:</strong> ${bank.accountName || agencyName}</div>
                <div><strong>Account Number:</strong> <span style="font-family: monospace; font-weight: 700; color: #0F172A;">${bank.accountNumber}</span></div>
                <div><strong>Bank Name:</strong> ${bank.bankName || 'Standard Chartered / HDFC'}</div>
                <div><strong>IFSC / Swift:</strong> <span style="font-family: monospace; font-weight: 700; color: #0F172A;">${bank.ifscCode || bank.swiftCode || '—'}</span></div>
                ${bank.upiId ? `<div><strong>UPI ID:</strong> <span style="font-family: monospace; font-weight: 700; color: #0F172A;">${bank.upiId}</span></div>` : ''}
              </div>
            </div>
          ` : ''}

          ${invoice.notes ? `
            <div style="font-size: 11px; color: #64748B; background: #FFFFFF; border: 1px dashed #CBD5E1; border-radius: 6px; padding: 10px 12px;">
              <div style="font-weight: 700; color: #475569; margin-bottom: 2px;">Notes / Payment Terms:</div>
              <div>${invoice.notes.replace(/<[^>]*>?/gm, '')}</div>
            </div>
          ` : ''}
        </div>

        <!-- Right Column: Financial Breakdown -->
        <div style="width: 280px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 14px 16px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; padding-bottom: 6px; color: #475569;">
            <span>Subtotal:</span>
            <span style="font-family: monospace; font-weight: 600;">${formatCurrency(invoice.subtotal, currency)}</span>
          </div>

          ${invoice.taxAmount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding-bottom: 6px; color: #475569;">
              <span>Tax (${invoice.taxRate}%):</span>
              <span style="font-family: monospace; font-weight: 600;">${formatCurrency(invoice.taxAmount, currency)}</span>
            </div>
          ` : ''}

          ${invoice.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding-bottom: 6px; color: #16A34A;">
              <span>Discount:</span>
              <span style="font-family: monospace; font-weight: 600;">-${formatCurrency(invoice.discount, currency)}</span>
            </div>
          ` : ''}

          <div style="display: flex; justify-content: space-between; padding: 10px 0 6px 0; border-top: 2px solid #CBD5E1; margin-top: 4px; font-size: 14px; font-weight: 800; color: #0F172A;">
            <span>Total Amount:</span>
            <span style="font-family: monospace;">${formatCurrency(invoice.totalAmount, currency)}</span>
          </div>

          ${(invoice.paidAmount || invoice.amountPaid || 0) > 0 ? `
            <div style="display: flex; justify-content: space-between; padding-bottom: 6px; color: #16A34A; font-weight: 600;">
              <span>Paid to Date:</span>
              <span style="font-family: monospace;">-${formatCurrency(invoice.paidAmount || invoice.amountPaid || 0, currency)}</span>
            </div>
          ` : ''}

          <div style="display: flex; justify-content: space-between; padding: 8px 10px; background: #EEF2FF; border-radius: 4px; border: 1px solid #C7D2FE; margin-top: 6px; font-size: 13px; font-weight: 800; color: #3730A3;">
            <span>Balance Due:</span>
            <span style="font-family: monospace;">${formatCurrency(invoice.balanceDue, currency)}</span>
          </div>
        </div>
      </div>

      <!-- Signature & Footer Section -->
      <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="font-size: 10px; color: #94A3B8; max-width: 360px;">
          This is a computer-generated tax invoice. If you have any inquiries regarding this document, please contact ${settings?.agencyEmail || 'support'}.
        </div>

        <div style="text-align: center; width: 200px;">
          <div style="height: 48px; border-bottom: 1px solid #475569; margin-bottom: 6px;"></div>
          <div style="font-size: 11px; font-weight: 700; color: #0F172A;">Authorized Signatory</div>
          <div style="font-size: 10px; color: #64748B;">For ${agencyName}</div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // Wait for fonts and any local resources to settle
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Render high-res canvas at 2x scale for crisp, print-quality text
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Standard A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Canvas aspect ratio
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      // Multi-page handling if content is long
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
    }

    const cleanInvoiceNumber = invoice.invoiceNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
    pdf.save(`Invoice-${cleanInvoiceNumber}.pdf`);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
