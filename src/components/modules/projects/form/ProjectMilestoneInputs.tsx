import React from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

export interface MilestoneDraft {
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
}

interface ProjectMilestoneInputsProps {
  milestones: MilestoneDraft[];
  onAddMilestone: () => void;
  onRemoveMilestone: (idx: number) => void;
  onUpdateMilestone: (idx: number, field: keyof MilestoneDraft, value: any) => void;
}

export function ProjectMilestoneInputs({
  milestones,
  onAddMilestone,
  onRemoveMilestone,
  onUpdateMilestone,
}: ProjectMilestoneInputsProps) {
  const totalBudget = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Phase Milestones & Deliverables</span>
          <p className="text-[11px] text-neutral-400">Total Contract Value: <span className="font-mono font-bold text-neutral-900 dark:text-white">{formatCurrency(totalBudget)}</span></p>
        </div>
        <button
          type="button"
          onClick={onAddMilestone}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" /><span>+ Add Phase</span>
        </button>
      </div>

      {milestones.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-dashed border-neutral-300 dark:border-[#334155] text-xs text-neutral-400 space-y-2">
          <Layers className="w-6 h-6 mx-auto opacity-50" />
          <p>No milestones configured. Click &quot;+ Add Phase&quot; to set up phased billings.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-neutral-50 dark:bg-[#0F172A] border border-neutral-200 dark:border-[#334155] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-neutral-400">Phase #{idx + 1}</span>
                <button type="button" onClick={() => onRemoveMilestone(idx)} className="text-neutral-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Phase Title (e.g. Design System & Wireframes)"
                  value={m.title}
                  onChange={(e) => onUpdateMilestone(idx, 'title', e.target.value)}
                  className="sm:col-span-2 px-3 py-1.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-900 dark:text-white"
                />
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Amount (₹)"
                  value={m.amount || ''}
                  onChange={(e) => onUpdateMilestone(idx, 'amount', Number(e.target.value))}
                  className="px-3 py-1.5 rounded bg-white dark:bg-[#1E293B] border border-neutral-300 dark:border-neutral-700 text-xs font-mono text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectMilestoneInputs;
