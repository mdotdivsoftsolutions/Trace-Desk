import React from 'react';
import { FileText, MapPin, Building, Globe, Mail, Phone } from 'lucide-react';
import { Client } from '@/types';
import SafeHTML from '@/components/common/SafeHTML';

interface ClientNotesTabProps {
  client: Client;
}

export function ClientNotesTab({ client }: ClientNotesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-3">
        <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-neutral-500" />
          <span>Billing & Entity Information</span>
        </h3>
        <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
          <div><span className="text-neutral-400 font-medium">Legal Name:</span> <span className="font-semibold text-neutral-900 dark:text-white ml-2">{client.company || client.name}</span></div>
          {client.taxId && <div><span className="text-neutral-400 font-medium">Tax / GSTIN ID:</span> <span className="font-mono font-bold text-neutral-900 dark:text-white ml-2">{client.taxId}</span></div>}
          {client.address && <div><span className="text-neutral-400 font-medium">Billing Address:</span> <span className="text-neutral-700 dark:text-neutral-300 ml-2">{client.address}</span></div>}
          <div><span className="text-neutral-400 font-medium">Country / Region:</span> <span className="text-neutral-700 dark:text-neutral-300 ml-2">{client.country || 'Global / Unspecified'}</span></div>
        </div>
      </div>

      <div className="p-5 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm space-y-3">
        <h3 className="font-heading text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-neutral-500" />
          <span>Internal Agency Notes</span>
        </h3>
        {client.notes ? (
          <SafeHTML html={client.notes} className="text-neutral-600 dark:text-neutral-300" />
        ) : (
          <p className="text-xs text-neutral-400 italic">No notes recorded for this client account.</p>
        )}
      </div>
    </div>
  );
}

export default ClientNotesTab;
