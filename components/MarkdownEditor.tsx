'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Code, List, ListOrdered, Link as LinkIcon } from 'lucide-react';
import { marked } from 'marked';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localValue.substring(start, end);
    
    const newValue = localValue.substring(0, start) + prefix + selectedText + suffix + localValue.substring(end);
    setLocalValue(newValue);
    onChange(newValue);
    
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => insertMarkdown('**', '**')}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all"
          title="Kalın (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('*', '*')}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all"
          title="İtalik (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('`', '`')}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all"
          title="Kod (Ctrl+K)"
        >
          <Code className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('- ', '')}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all"
          title="Liste (Ctrl+L)"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('1. ', '')}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all"
          title="Numaralı Liste (Ctrl+O)"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('[', '](url)')}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-all"
          title="Link (Ctrl+Shift+K)"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`p-2 text-white rounded transition-all ${
            isPreview ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title="Önizleme"
        >
          {isPreview ? '✏️' : '👁️'}
        </button>
      </div>

      {!isPreview ? (
        <textarea
          ref={textareaRef}
          id="markdown-textarea"
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          rows={12}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none font-mono"
        />
      ) : (
        <div
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 min-h-[300px] prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(localValue) }}
        />
      )}
    </div>
  );
}
