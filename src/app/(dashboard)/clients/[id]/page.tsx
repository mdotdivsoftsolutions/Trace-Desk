'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useClient, useDeleteClient } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { useInvoices } from '@/hooks/useInvoices';
import { ProjectType, InvoiceType } from '@/types';
import { ClientHeaderBanner } from '@/components/modules/clients/detail/ClientHeaderBanner';
import { ClientFinancialKpis } from '@/components/modules/clients/detail/ClientFinancialKpis';
import { ClientProjectsTab } from '@/components/modules/clients/detail/ClientProjectsTab';
import { ClientInvoicesTab } from '@/components/modules/clients/detail/ClientInvoicesTab';
import { ClientNotesTab } from '@/components/modules/clients/detail/ClientNotesTab';
import { ClientFormDrawer } from '@/components/modules/clients/ClientFormDrawer';
import { ProjectFormDrawer } from '@/components/modules/projects/ProjectFormDrawer';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { cn } from '@/lib/utils';

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'invoices' | 'notes'>('projects');
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isNewProjectDrawerOpen, setIsNewProjectDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: client, isLoading: isClientLoading } = useClient(id);
  const { data: projectsData } = useProjects({ clientId: id });
  const { data: invoicesData } = useInvoices({ clientId: id });
  const deleteClientMutation = useDeleteClient();

  if (isClientLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-500 mt-2">Loading client profile...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-12 text-center text-neutral-500">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">Client Not Found</h2>
        <p className="text-xs mt-1">This client account may have been deleted.</p>
      </div>
    );
  }

  const projects = projectsData?.items || [];
  const invoices = invoicesData?.items || [];
  const totalBilled = invoices.reduce((sum: number, inv: InvoiceType) => sum + inv.totalAmount, 0);
  const totalOutstanding = invoices.reduce((sum: number, inv: InvoiceType) => sum + inv.balanceDue, 0);
  const totalCollected = totalBilled - totalOutstanding;
  const activeProjectsCount = projects.filter((p: ProjectType) => ['discovery', 'in_progress', 'review'].includes(p.status)).length;

  return (
    <div className="space-y-6">
      <ClientHeaderBanner client={client} onEdit={() => setIsEditDrawerOpen(true)} onAddProject={() => setIsNewProjectDrawerOpen(true)} onDelete={() => setIsDeleteDialogOpen(true)} />
      <ClientFinancialKpis totalBilled={totalBilled} totalCollected={totalCollected} totalOutstanding={totalOutstanding} activeProjectsCount={activeProjectsCount} />
      <div className="border-b border-neutral-200 dark:border-[#334155] flex gap-6 text-xs font-semibold">
        {(['projects', 'invoices', 'notes'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn('pb-3 capitalize transition-colors relative', activeTab === tab ? 'text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white font-bold' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white')}>
            {tab} {tab === 'projects' && `(${projects.length})`} {tab === 'invoices' && `(${invoices.length})`}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'projects' && <ClientProjectsTab projects={projects} clientId={id} onAddProject={() => setIsNewProjectDrawerOpen(true)} />}
        {activeTab === 'invoices' && <ClientInvoicesTab invoices={invoices} clientId={id} />}
        {activeTab === 'notes' && <ClientNotesTab client={client} />}
      </div>
      <ClientFormDrawer isOpen={isEditDrawerOpen} onClose={() => setIsEditDrawerOpen(false)} client={client} />
      <ProjectFormDrawer isOpen={isNewProjectDrawerOpen} onClose={() => setIsNewProjectDrawerOpen(false)} preselectedClientId={id} />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Client Account"
        description={`Are you sure you want to delete ${client.name}? All linked records will be affected.`}
        confirmText="Delete Client"
        variant="danger"
        isLoading={deleteClientMutation.isPending}
        onConfirm={async () => { await deleteClientMutation.mutateAsync(id); router.push('/clients'); }}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
