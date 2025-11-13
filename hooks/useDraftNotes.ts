import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAFT_KEY = 'note_drafts';

export interface DraftNote {
  id: string;
  title: string;
  content: string;
  tags: string;
  createdAt: string;
}

export function useDraftNotes() {
  const [drafts, setDrafts] = useState<DraftNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const data = await AsyncStorage.getItem(DRAFT_KEY);
      if (data) {
        setDrafts(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (draft: DraftNote) => {
    try {
      const updated = drafts.filter(d => d.id !== draft.id);
      updated.push(draft);
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
      setDrafts(updated);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const removeDraft = async (id: string) => {
    try {
      const updated = drafts.filter(d => d.id !== id);
      await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
      setDrafts(updated);
    } catch (error) {
      console.error('Failed to remove draft:', error);
    }
  };

  const clearDrafts = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_KEY);
      setDrafts([]);
    } catch (error) {
      console.error('Failed to clear drafts:', error);
    }
  };

  return { drafts, loading, saveDraft, removeDraft, clearDrafts };
}
