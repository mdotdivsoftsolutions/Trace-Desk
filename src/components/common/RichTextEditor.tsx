'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Link as LinkIcon,
  RemoveFormatting,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Write notes, deliverables, or specifications...',
  minHeight = '140px',
  className,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isInternalUpdate = useRef(false);

  // Sync incoming value with contentEditable without resetting cursor if user is typing
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalUpdate.current = false;
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      const html = editorRef.current.innerHTML;
      onChange?.(html === '<br>' || html === '<p><br></p>' ? '' : html);
    }
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (disabled) return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInsertLink = () => {
    if (disabled) return;
    const url = prompt('Enter web or documentation URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div
      className={cn(
        'w-full rounded-lg border bg-neutral-50 dark:bg-[#0A0A0A] transition-all overflow-hidden flex flex-col',
        isFocused
          ? 'border-indigo-500 ring-2 ring-indigo-500/20'
          : 'border-neutral-300 dark:border-neutral-700',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-neutral-200 dark:border-[#2A2A2A] bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-sm text-neutral-600 dark:text-neutral-300">
        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('bold')}
          title="Bold (Ctrl+B)"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('italic')}
          title="Italic (Ctrl+I)"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('underline')}
          title="Underline (Ctrl+U)"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('strikeThrough')}
          title="Strikethrough"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-[#2A2A2A] mx-1" />

        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('formatBlock', '<h2>')}
          title="Section Heading (H2)"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('formatBlock', '<h3>')}
          title="Subheading (H3)"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-[#2A2A2A] mx-1" />

        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('insertUnorderedList')}
          title="Bullet List"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('insertOrderedList')}
          title="Numbered List"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-[#2A2A2A] mx-1" />

        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('formatBlock', '<pre>')}
          title="Code Block"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          title="Blockquote"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={handleInsertLink}
          title="Insert Link"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-neutral-200 dark:bg-[#2A2A2A] mx-1" />

        <button
          type="button"
          disabled={disabled}
          onClick={() => executeCommand('removeFormat')}
          title="Clear Formatting"
          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className={cn(
          'flex-1 p-3.5 outline-none text-xs leading-relaxed text-neutral-900 dark:text-neutral-100 font-sans',
          'prose prose-xs dark:prose-invert max-w-none',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-400 empty:before:pointer-events-none empty:before:block',
          '[&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-2 [&_h2]:mb-1',
          '[&_h3]:text-xs [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1',
          '[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1',
          '[&_blockquote]:border-l-2 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-1.5 [&_blockquote]:text-neutral-500',
          '[&_pre]:bg-neutral-200/60 [&_pre]:dark:bg-[#1A1A1A] [&_pre]:p-2 [&_pre]:rounded [&_pre]:font-mono [&_pre]:text-[11px] [&_pre]:my-1.5',
          '[&_a]:text-indigo-600 [&_a]:dark:text-indigo-400 [&_a]:underline'
        )}
      />
    </div>
  );
}

export default RichTextEditor;
