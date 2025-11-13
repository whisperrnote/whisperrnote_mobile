import { getCurrentUser } from './auth';
import type { Notes } from '@whisperrnote_mobile/types/appwrite.d.ts';

export interface ShareLink {
  id: string;
  noteId: string;
  token: string;
  expiresAt?: string;
  maxViews?: number;
  viewCount: number;
  createdAt: string;
  createdBy: string;
}

export interface SharedNote extends Notes {
  sharedBy: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  shareAccessLevel: 'viewer' | 'editor' | 'admin';
  sharedAt: string;
}

export async function createShareLink(
  noteId: string,
  options?: {
    expiresIn?: number; // days
    maxViews?: number;
    requirePassword?: boolean;
    password?: string;
  }
): Promise<string> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const response = await fetch('/api/sharing/create-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteId,
        expiresIn: options?.expiresIn,
        maxViews: options?.maxViews,
        requirePassword: options?.requirePassword,
        password: options?.password,
      }),
    });

    if (!response.ok) throw new Error('Failed to create share link');
    const data = await response.json();
    return data.shareLink;
  } catch (error) {
    console.error('Failed to create share link:', error);
    throw error;
  }
}

export async function revokeShareLink(linkId: string): Promise<void> {
  try {
    const response = await fetch(`/api/sharing/revoke-link/${linkId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to revoke share link');
  } catch (error) {
    console.error('Failed to revoke share link:', error);
    throw error;
  }
}

export async function accessSharedNote(token: string, password?: string): Promise<SharedNote | null> {
  try {
    const response = await fetch('/api/sharing/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to access shared note:', error);
    return null;
  }
}

export async function getMySharedLinks(): Promise<ShareLink[]> {
  const user = await getCurrentUser();
  if (!user?.$id) return [];

  try {
    const response = await fetch('/api/sharing/my-links', {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.links || [];
  } catch (error) {
    console.error('Failed to fetch shared links:', error);
    return [];
  }
}

export async function getSharedWithMe(): Promise<SharedNote[]> {
  const user = await getCurrentUser();
  if (!user?.$id) return [];

  try {
    const response = await fetch('/api/sharing/shared-with-me', {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.notes || [];
  } catch (error) {
    console.error('Failed to fetch notes shared with me:', error);
    return [];
  }
}

export async function unshareNote(noteId: string, userId: string): Promise<void> {
  try {
    const response = await fetch('/api/sharing/unshare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId, userId }),
    });

    if (!response.ok) throw new Error('Failed to unshare note');
  } catch (error) {
    console.error('Failed to unshare note:', error);
    throw error;
  }
}

export async function changeShareAccessLevel(
  noteId: string,
  userId: string,
  accessLevel: 'viewer' | 'editor' | 'admin'
): Promise<void> {
  try {
    const response = await fetch('/api/sharing/access-level', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteId, userId, accessLevel }),
    });

    if (!response.ok) throw new Error('Failed to change access level');
  } catch (error) {
    console.error('Failed to change access level:', error);
    throw error;
  }
}

export async function getShareStatistics(noteId: string): Promise<{
  viewCount: number;
  shareCount: number;
  collaborators: number;
  lastViewedAt?: string;
} | null> {
  try {
    const response = await fetch(`/api/sharing/stats/${noteId}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch share statistics:', error);
    return null;
  }
}

export async function publishNoteAsArticle(
  noteId: string,
  title: string,
  description?: string
): Promise<string> {
  try {
    const response = await fetch('/api/publish/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteId,
        title,
        description,
      }),
    });

    if (!response.ok) throw new Error('Failed to publish article');
    const data = await response.json();
    return data.articleUrl;
  } catch (error) {
    console.error('Failed to publish article:', error);
    throw error;
  }
}
