import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

export function SafeHTML({ html, className = '' }: SafeHTMLProps) {
  const sanitizedHTML = DOMPurify.sanitize(html || '');

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none text-xs ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}

export default SafeHTML;
