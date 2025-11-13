import { getCurrentUser } from './auth';

export interface UserMetrics {
  totalNotes: number;
  totalTags: number;
  totalCollaborators: number;
  notesCreatedThisMonth: number;
  notesUpdatedThisMonth: number;
  averageNotesPerDay: number;
  totalWords: number;
  totalCharacters: number;
  attachmentsCount: number;
  storageUsed: number;
  lastActivityAt: string;
}

export interface NoteMetrics {
  noteId: string;
  views: number;
  shares: number;
  comments: number;
  collaborators: number;
  versions: number;
  wordCount: number;
  characterCount: number;
  attachmentsCount: number;
  lastAccessedAt: string;
  lastModifiedAt: string;
}

export interface UsageMetrics {
  period: 'daily' | 'weekly' | 'monthly';
  notesCreated: number;
  notesModified: number;
  notesDeleted: number;
  collaborationsAdded: number;
  attachmentsUploaded: number;
  aiRequestsUsed: number;
  storageUsedMB: number;
  apiCallsUsed: number;
}

export async function getUserMetrics(): Promise<UserMetrics | null> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const response = await fetch('/api/usage/metrics/user', {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user metrics:', error);
    return null;
  }
}

export async function getNoteMetrics(noteId: string): Promise<NoteMetrics | null> {
  try {
    const response = await fetch(`/api/usage/metrics/note/${noteId}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch note metrics:', error);
    return null;
  }
}

export async function getUsageMetrics(period: 'daily' | 'weekly' | 'monthly'): Promise<UsageMetrics | null> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const response = await fetch(`/api/usage/metrics/usage?period=${period}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch usage metrics:', error);
    return null;
  }
}

export async function trackNoteView(noteId: string): Promise<void> {
  try {
    await fetch('/api/usage/track/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId }),
    });
  } catch (error) {
    console.error('Failed to track note view:', error);
  }
}

export async function trackNoteShare(noteId: string, sharedWith?: string): Promise<void> {
  try {
    await fetch('/api/usage/track/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId, sharedWith }),
    });
  } catch (error) {
    console.error('Failed to track note share:', error);
  }
}

export async function getStorageUsage(): Promise<{ used: number; limit: number; percentage: number } | null> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const response = await fetch('/api/usage/storage', {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch storage usage:', error);
    return null;
  }
}

export async function getActivityLog(limit: number = 50): Promise<any[]> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const response = await fetch(`/api/usage/activity?limit=${limit}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.activities || [];
  } catch (error) {
    console.error('Failed to fetch activity log:', error);
    return [];
  }
}
