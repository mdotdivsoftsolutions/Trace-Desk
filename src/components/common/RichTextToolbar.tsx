'use client';

import React from 'react';
import { Bold, Italic, List, ListOrdered, Code, Heading2 } from 'lucide-react';

interface RichTextToolbarProps {
  onFormat: (prefix: string, suffix?: string) => void;
}

export function RichTextToolbar({ onFormat }: RichTextToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 dark:border-[#334155] bg-neutral-50 dark:bg-[#0F172A]">
      <button type="button" onClick={() => onFormat('## ', '')} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white" title="Heading">
        <Heading2 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onFormat('**', '**')} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white" title="Bold">
        <Bold className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onFormat('_', '_')} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white" title="Italic">
        <Italic className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onFormat('- ', '')} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white" title="Bullet List">
        <List className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onFormat('1. ', '')} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white" title="Numbered List">
        <ListOrdered className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onFormat('`', '`')} className="p-1.5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white" title="Code">
        <Code className="w-4 h-4" />
      </button>
    </div>
  );
}

export default RichTextToolbar;
