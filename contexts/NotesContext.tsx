import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createNote, updateNote, deleteNote, listNotes, getNote } from '@/lib/appwrite/notes';
import type { Notes } from '@/types/appwrite';

interface NotesContextType {
  notes: Notes[];
  currentNote: Notes | null;
  loading: boolean;
  fetchNotes: () => Promise<void>;
  fetchNote: (id: string) => Promise<void>;
  addNote: (data: Partial<Notes>) => Promise<Notes>;
  updateCurrentNote: (id: string, data: Partial<Notes>) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  clearCurrent: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Notes[]>([]);
  const [currentNote, setCurrentNote] = useState<Notes | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const result = await listNotes([], 100);
      setNotes(result.documents);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const note = await getNote(id);
      setCurrentNote(note);
    } catch (error) {
      console.error('Failed to fetch note:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback(async (data: Partial<Notes>) => {
    try {
      setLoading(true);
      const newNote = await createNote(data);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCurrentNote = useCallback(async (id: string, data: Partial<Notes>) => {
    try {
      setLoading(true);
      const updated = await updateNote(id, data);
      setCurrentNote(updated);
      setNotes(prev => prev.map(n => n.$id === id ? updated : n));
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n.$id !== id));
      if (currentNote?.$id === id) {
        setCurrentNote(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentNote]);

  const clearCurrent = useCallback(() => {
    setCurrentNote(null);
  }, []);

  const value: NotesContextType = {
    notes,
    currentNote,
    loading,
    fetchNotes,
    fetchNote,
    addNote,
    updateCurrentNote,
    removeNote,
    clearCurrent
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
}
