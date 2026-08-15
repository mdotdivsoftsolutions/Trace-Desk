'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useClient, useDeleteClient, useDeactivateClient, useReactivateClient } from '@/hooks/useClients';
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
import { TabBar, TabPanel } from '@/components/common/TabPanel';
import { ClientDetailSkeleton } from '@/components/common/skeletons/ClientDetailSkeleton';

type ClientTab = 'projects' | 'invoices' | 'notes';

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ClientTab>('projects');
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isNewProjectDrawerOpen, setIsNewProjectDrawerOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: client, isLoading } = useClient(id);
  const { data: projectsData } = useProjects({ clientId: id });
  const { data: invoicesData } = useInvoices({ clientId: id });

  const deactivateMutation = useDeactivateClient();
  const reactivateMutation = useReactivateClient();
  const deleteClientMutation = useDeleteClient();

  if (isLoading) {
    return <ClientDetailSkeleton />;
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

  const clientTabs = [
    { key: 'projects',  label: 'Projects',  count: projects.length },
    { key: 'invoices',  label: 'Invoices',  count: invoices.length },
    { key: 'notes',     label: 'Notes' },
  ];

  return (
    <div className="space-y-6">
      <ClientHeaderBanner
        client={client}
        onEdit={() => setIsEditDrawerOpen(true)}
        onAddProject={() => setIsNewProjectDrawerOpen(true)}
        onDeactivate={() => setIsDeactivateDialogOpen(true)}
        onReactivate={() => setIsReactivateDialogOpen(true)}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />
      <ClientFinancialKpis
        totalBilled={totalBilled}
        totalCollected={totalCollected}
        totalOutstanding={totalOutstanding}
        activeProjectsCount={activeProjectsCount}
      />

      {/* CLS-safe tab bar */}
      <TabBar
        tabs={clientTabs}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as ClientTab)}
      />

      {/* CLS-safe panels */}
      <TabPanel tabKey="projects" activeTab={activeTab} minHeight={260}>
        <ClientProjectsTab projects={projects} clientId={id} onAddProject={() => setIsNewProjectDrawerOpen(true)} />
      </TabPanel>
      <TabPanel tabKey="invoices" activeTab={activeTab} minHeight={260}>
        <ClientInvoicesTab invoices={invoices} clientId={id} />
      </TabPanel>
      <TabPanel tabKey="notes" activeTab={activeTab} minHeight={180}>
        <ClientNotesTab client={client} />
      </TabPanel>

      <ClientFormDrawer isOpen={isEditDrawerOpen} onClose={() => setIsEditDrawerOpen(false)} client={client} />
      <ProjectFormDrawer isOpen={isNewProjectDrawerOpen} onClose={() => setIsNewProjectDrawerOpen(false)} preselectedClientId={id} />

      {/* Deactivate Dialog */}
      <ConfirmDialog
        isOpen={isDeactivateDialogOpen}
        title="Deactivate Client Account"
        description={`Are you sure you want to deactivate "${client.name}"? All existing projects, invoices, and financial records will be preserved safely.`}
        confirmText="Deactivate Client"
        variant="warning"
        isLoading={deactivateMutation.isPending}
        onConfirm={async () => {
          await deactivateMutation.mutateAsync(id);
          setIsDeactivateDialogOpen(false);
        }}
        onCancel={() => setIsDeactivateDialogOpen(false)}
      />

      {/* Reactivate Dialog */}
      <ConfirmDialog
        isOpen={isReactivateDialogOpen}
        title="Reactivate Client Account"
        description={`Reactivate "${client.name}" as an active client account in your agency directory?`}
        confirmText="Reactivate Client"
        variant="info"
        isLoading={reactivateMutation.isPending}
        onConfirm={async () => {
          await reactivateMutation.mutateAsync(id);
          setIsReactivateDialogOpen(false);
        }}
        onCancel={() => setIsReactivateDialogOpen(false)}
      />

      {/* Permanent Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Permanently Delete Client Account"
        description={`Are you sure you want to permanently delete "${client.name}"? This action cannot be undone and will permanently remove this record.`}
        confirmText="Delete Permanently"
        variant="danger"
        isLoading={deleteClientMutation.isPending}
        onConfirm={async () => {
          await deleteClientMutation.mutateAsync({ id, soft: false });
          router.push('/clients');
        }}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
