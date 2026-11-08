'use client';

import React, { useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your note here...',
  disabled = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const sanitizeConfig = {
    ALLOWED_TAGS: [
      'b',
      'i',
      'u',
      'strong',
      'em',
      'ul',
      'ol',
      'li',
      'p',
      'br',
      'h1',
      'h2',
      'h3',
      'a',
    ],
    ALLOWED_ATTR: ['href', 'rel'],
    FORCE_BODY: true,
    ADD_ATTR: ['rel'],
    FORBID_ATTR: ['style', 'class'],
  };

  const sanitizeContent = (html: string): string => {
    if (typeof window === 'undefined') return html;
    return DOMPurify.sanitize(html, sanitizeConfig);
  };

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      const html = editorRef.current.innerHTML;
      const clean = sanitizeContent(html);
      onChange(clean);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (disabled) return;
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleLink = () => {
    if (disabled) return;
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="editor-toolbar-btn"
          title="Bold"
          disabled={disabled}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="editor-toolbar-btn"
          title="Italic"
          disabled={disabled}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="editor-toolbar-btn"
          title="Underline"
          disabled={disabled}
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="editor-toolbar-btn"
          title="Bullet List"
          disabled={disabled}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="editor-toolbar-btn"
          title="Numbered List"
          disabled={disabled}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="editor-toolbar-btn"
          title="Heading"
          disabled={disabled}
        >
          H3
        </button>
        <button
          type="button"
          onClick={handleLink}
          className="editor-toolbar-btn"
          title="Insert Link"
          disabled={disabled}
        >
          Link
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        className="editor-content"
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;

