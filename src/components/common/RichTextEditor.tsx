'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
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
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'w-full p-3 text-xs bg-transparent text-neutral-900 dark:text-white focus:outline-none min-h-[100px] leading-relaxed prose prose-sm dark:prose-invert max-w-none',
      },
    },
  });

  // Update content if value changes from outside (e.g. form reset or initial load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className={cn('rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1E293B] overflow-hidden focus-within:ring-2 focus-within:ring-neutral-400', className)}>
      <RichTextToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextEditor;
