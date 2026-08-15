'use client';

import React from 'react';
import { Bold, Italic, List, ListOrdered, Code, Heading2 } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface RichTextToolbarProps {
  editor: Editor | null;
}

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-neutral-200 dark:border-[#334155] bg-neutral-50 dark:bg-[#0F172A]">
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        className={`p-1.5 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} 
        title="Heading"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} 
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} 
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} 
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} 
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleCode().run()} 
        className={`p-1.5 rounded ${editor.isActive('code') ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`} 
        title="Code"
      >
        <Code className="w-4 h-4" />
      </button>
    </div>
  );
}

export default RichTextToolbar;
