import React from 'react';
import Link from 'next/link';
import { Layers, Plus, Calendar, Receipt, Edit, Trash2 } from 'lucide-react';
import { Milestone } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { SafeHTML } from '@/components/common/SafeHTML';

interface ProjectMilestonesTabProps {
  milestones: Milestone[];
  projectId: string;
  onAddMilestone: () => void;
  onEditMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (milestone: Milestone) => void;
}

const milestoneStatusBadge: Record<string, string> = {
  pending: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  in_progress: 'bg-neutral-100 dark:bg-[#334155] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#334155]',
  completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  invoiced: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

export function ProjectMilestonesTab({
  milestones,
  projectId,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
}: ProjectMilestonesTabProps) {
  if (milestones.length === 0) {
    return (
      <div className="p-12 text-center rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] space-y-3">
        <Layers className="w-8 h-8 text-neutral-400 mx-auto" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No milestones added</h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">Break down project deliverables into phases with allocated budgets and deadlines.</p>
        <button onClick={onAddMilestone} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
          <Plus className="w-3.5 h-3.5" /><span>Create Milestone</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Project Deliverables & Phases</h3>
        <button onClick={onAddMilestone} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" /><span>+ Add Milestone</span>
        </button>
      </div>

      <div className="space-y-3">
        {milestones.map((m, idx) => {
          const milestoneAmt = m.allocatedAmount ?? m.amount ?? 0;
          const isInvoiced = m.status === 'invoiced' || Boolean(m.invoiceId);
          const canCreateInvoice = m.status === 'completed' && !isInvoiced;

          return (
            <div key={m._id} className="p-4 rounded-lg bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold text-neutral-400">#{idx + 1}</span>
                  <span className="font-heading font-bold text-sm text-neutral-900 dark:text-white">{m.title}</span>
                  <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider', milestoneStatusBadge[m.status] || 'bg-neutral-500/10 text-neutral-400')}>
                    {m.status.replace('_', ' ')}
                  </span>
                  {isInvoiced && m.status !== 'invoiced' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
                      Invoiced
                    </span>
                  )}
                </div>
                {m.description && (
                  <div className="text-xs text-neutral-600 dark:text-neutral-300">
                    <SafeHTML html={m.description} />
                  </div>
                )}
                {m.dueDate && (
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 pt-0.5">
                    <Calendar className="w-3 h-3 text-neutral-700 dark:text-neutral-300" />
                    <span>Target: {formatDate(m.dueDate)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto flex-shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Allocated Amount</span>
                  <span className="font-extrabold text-neutral-900 dark:text-white font-mono">{formatCurrency(milestoneAmt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  {canCreateInvoice && (
                    <Link href={`/invoices/new?projectId=${projectId}&milestoneId=${m._id}`} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-neutral-100 dark:bg-[#0F172A] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155]">
                      <Receipt className="w-3.5 h-3.5" /><span>Create Invoice</span>
                    </Link>
                  )}
                  {isInvoiced && m.invoiceId && (
                    <Link href={`/invoices/${m.invoiceId}`} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                      <Receipt className="w-3.5 h-3.5" /><span>View Invoice</span>
                    </Link>
                  )}
                  <button onClick={() => onEditMilestone(m)} className="p-1.5 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white" title="Edit Milestone"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => onDeleteMilestone(m)} className="p-1.5 rounded text-neutral-400 hover:text-rose-600" title="Delete Milestone"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectMilestonesTab;
