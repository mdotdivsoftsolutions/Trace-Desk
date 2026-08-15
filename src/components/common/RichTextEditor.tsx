'use client';

import React, { useRef } from 'react';
import { RichTextToolbar } from './RichTextToolbar';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write details here...',
  className,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);

    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    onChange(`${before}${replacement}${after}`);
  };

  return (
    <div className={cn('rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E293B] overflow-hidden focus-within:ring-2 focus-within:ring-neutral-400', className)}>
      <RichTextToolbar onFormat={handleFormat} />
      <textarea
        ref={textareaRef}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 text-xs bg-transparent text-neutral-900 dark:text-white focus:outline-none resize-y min-h-[100px] font-mono leading-relaxed"
      />
    </div>
  );
}

export default RichTextEditor;
