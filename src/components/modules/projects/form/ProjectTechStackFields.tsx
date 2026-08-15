import React from 'react';
import { X, Plus } from 'lucide-react';

interface ProjectTechStackFieldsProps {
  techStack: string[];
  techInput: string;
  onTechInputChange: (val: string) => void;
  onAddTech: () => void;
  onRemoveTech: (tech: string) => void;
}

export function ProjectTechStackFields({
  techStack,
  techInput,
  onTechInputChange,
  onAddTech,
  onRemoveTech,
}: ProjectTechStackFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">Tech Stack & Tools</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Next.js, Node.js, Tailwind, MongoDB"
            value={techInput}
            onChange={(e) => onTechInputChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddTech(); } }}
            className="flex-1 px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-[#0F172A] border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
          <button
            type="button"
            onClick={onAddTech}
            className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold hover:bg-neutral-800"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {techStack.map((tech) => (
              <span key={tech} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 dark:bg-[#334155] text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-[#334155] text-[11px] font-semibold">
                <span>{tech}</span>
                <button type="button" onClick={() => onRemoveTech(tech)} className="text-neutral-400 hover:text-rose-500"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectTechStackFields;
