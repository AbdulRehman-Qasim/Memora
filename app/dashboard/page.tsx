'use client';

import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import notesService from '@/services/notes.service';
import { Note } from '@/types/notes.types';
import UserProfileModal from '@/components/UserProfileModal';
import NoteEditorModal from '@/components/NoteEditorModal';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';

type SortOrder = 'newest' | 'oldest' | 'title-az' | 'title-za';

interface ImportNoteEntry {
  title: string;
  content: string;
}

function sanitize(html: string): string {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li', 'p', 'br', 'h1', 'h2', 'h3', 'a'],
    ALLOWED_ATTR: ['href', 'rel'],
    FORCE_BODY: true,
    ADD_ATTR: ['rel'],
    FORBID_ATTR: ['style', 'class'],
  });
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');

  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pinnedNoteIds, setPinnedNoteIds] = useState<string[]>(() => {
    if (typeof window === 'undefined' || !user) return [];
    try {
      const saved = localStorage.getItem(`memoora_pins_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });



  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await notesService.getNotes();
      if (response.success && response.data) {
        setNotes(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const togglePin = (noteId: string) => {
    setPinnedNoteIds((prev) => {
      let newPins = [...prev];
      if (newPins.includes(noteId)) {
        newPins = newPins.filter((id) => id !== noteId);
      } else {
        newPins.push(noteId);
      }
      if (user) {
        localStorage.setItem(`memoora_pins_${user.id}`, JSON.stringify(newPins));
      }
      return newPins;
    });
  };

  const handleCreateNote = async (title: string, content: string) => {
    setIsCreating(true);
    setCreateError('');
    try {
      const response = await notesService.createNote({ title, content });
      if (response.success && response.data) {
        setNotes((prev) => [response.data!, ...prev]);
        setIsCreateModalOpen(false);
        toast.success('Note created successfully!');
      }
    } catch (err: any) {
      setCreateError(err.response?.data?.error || 'Failed to create note');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateNote = async (title: string, content: string) => {
    if (!editingNote) return;
    setIsUpdating(true);
    setEditError('');
    try {
      const response = await notesService.updateNote(editingNote.id, { title, content });
      if (response.success && response.data) {
        setNotes((prev) =>
          prev.map((n) => (n.id === editingNote.id ? response.data! : n))
        );
        setEditingNote(null);
        toast.success('Note updated!');
      }
    } catch (err: any) {
      setEditError(err.response?.data?.error || 'Failed to update note');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);
    try {
      await notesService.deleteNote(noteToDelete.id);
      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      setPinnedNoteIds((prev) => prev.filter((id) => id !== noteToDelete.id));
      setNoteToDelete(null);
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (notes.length === 0) {
      toast.error('No notes to export');
      return;
    }
    const headers = ['ID', 'Title', 'Content', 'Created At', 'Updated At'];
    const rows = notes.map((n) => [
      `"${n.id.replace(/"/g, '""')}"`,
      `"${n.title.replace(/"/g, '""')}"`,
      `"${n.content.replace(/"/g, '""')}"`,
      `"${n.createdAt}"`,
      `"${n.updatedAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `memoora-notes-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Notes exported as CSV');
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          toast.error('CSV file has no data');
          return;
        }

        const entries: ImportNoteEntry[] = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i];
          const parts = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (parts.length >= 3) {
            const title = parts[1].replace(/^"|"$/g, '').replace(/""/g, '"').trim();
            const content = parts[2].replace(/^"|"$/g, '').replace(/""/g, '"').trim();
            if (title) {
              entries.push({ title, content });
            }
          }
        }

        if (entries.length === 0) {
          toast.error('No valid notes found in CSV');
          return;
        }

        const res = await notesService.importNotes(entries);
        if (res.success && res.data) {
          setNotes((prev) => [...res.data!, ...prev]);
          toast.success(`Imported ${res.data.length} notes!`);
        }
      } catch {
        toast.error('Failed to import notes from CSV');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const processedNotes = useMemo(() => {
    let result = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    result.sort((a, b) => {
      const isAPinned = pinnedNoteIds.includes(a.id);
      const isBPinned = pinnedNoteIds.includes(b.id);
      if (isAPinned && !isBPinned) return -1;
      if (!isAPinned && isBPinned) return 1;

      switch (sortOrder) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title-az':
          return a.title.localeCompare(b.title);
        case 'title-za':
          return b.title.localeCompare(a.title);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [notes, searchQuery, sortOrder, pinnedNoteIds]);

  if (authLoading || (!user && loading)) {
    return (
      <div className="dashboard-loading" style={{ textAlign: 'center', padding: '4rem' }}>
        <h3>Loading notebook...</h3>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-title">My Notes</h1>
          <p className="dashboard-subtitle">
            Welcome back, <strong>{user?.name}</strong>!
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsProfileModalOpen(true)}
          >
            Profile
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + New Note
          </button>
        </div>
      </div>

      <div className="notes-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control"
          style={{ flex: 1, minWidth: '220px' }}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-az">Title (A - Z)</option>
          <option value="title-za">Title (Z - A)</option>
        </select>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleExportCSV}
          title="Export notes to CSV"
        >
          Export CSV
        </button>
        <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
          Import CSV
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportFileChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {error && <div className="delete-error-banner">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Fetching notes...</div>
      ) : processedNotes.length === 0 ? (
        <div className="no-results">
          {searchQuery ? 'No notes matched your search query.' : 'You have no notes yet. Create your first note!'}
        </div>
      ) : (
        <div className="notes-grid">
          {processedNotes.map((note) => {
            const isPinned = pinnedNoteIds.includes(note.id);
            return (
              <div key={note.id} className={`note-card ${isPinned ? 'pinned' : ''}`}>
                <div className="note-card-header">
                  <h3 className="note-title">{note.title}</h3>
                  <button
                    type="button"
                    onClick={() => togglePin(note.id)}
                    className="pin-btn"
                    title={isPinned ? 'Unpin note' : 'Pin note'}
                  >
                    {isPinned ? '📌' : '📍'}
                  </button>
                </div>
                <div
                  className="note-body"
                  dangerouslySetInnerHTML={{ __html: sanitize(note.content) }}
                />
                <div className="note-card-footer">
                  <span className="note-date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <div className="note-card-actions">
                    <button
                      type="button"
                      onClick={() => setEditingNote(note)}
                      className="note-action-btn"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoteToDelete(note)}
                      className="note-action-btn delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Editor Modal */}
      <NoteEditorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateNote}
        isSubmitting={isCreating}
        error={createError}
      />

      {editingNote && (
        <NoteEditorModal
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          onSubmit={handleUpdateNote}
          initialNote={editingNote}
          isSubmitting={isUpdating}
          error={editError}
        />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        title="Confirm Deletion"
      >
        <p>
          Are you sure you want to delete note &ldquo;<strong>{noteToDelete?.title}</strong>&rdquo;? This action cannot be undone.
        </p>
        <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setNoteToDelete(null)}
            className="btn-secondary"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteNote}
            className="btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Note'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

