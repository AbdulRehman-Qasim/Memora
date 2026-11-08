'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import RichTextEditor from './RichTextEditor';
import { Note } from '@/types/notes.types';

interface NoteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
  initialNote?: Note | null;
  isSubmitting: boolean;
  error?: string;
}

const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialNote,
  isSubmitting,
  error,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialNote, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit(title, content);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialNote ? 'Edit Note' : 'Create Note'}
    >
      <form onSubmit={handleSubmit} className="editor-form">
        {error && <div className="edit-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="form-control"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Type your note here..."
            disabled={isSubmitting}
          />
        </div>
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || !title.trim()}
          >
            {isSubmitting
              ? 'Saving...'
              : initialNote
              ? 'Save Changes'
              : 'Create Note'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NoteEditorModal;

