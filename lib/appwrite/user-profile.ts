import { storage, APPWRITE_BUCKET_PROFILE_PICTURES, ID } from './core';
import { getCurrentUser } from './auth';
import type { Users } from '@/types/appwrite.d.ts';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export async function updateUserProfile(data: Partial<{
  name: string;
  bio?: string;
  walletAddress?: string;
}>): Promise<Users | null> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const response = await fetch('/api/user-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
}

export async function uploadProfilePicture(
  fileUri: string,
  fileName: string
): Promise<string> {
  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const binaryString = atob(fileContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: 'image/jpeg' });
    const fileId = ID.unique();

    const response = await storage.createFile(
      APPWRITE_BUCKET_PROFILE_PICTURES,
      fileId,
      blob as any
    );

    return response.$id;
  } catch (error) {
    console.error('Failed to upload profile picture:', error);
    throw error;
  }
}

export async function deleteProfilePicture(fileId: string): Promise<void> {
  try {
    await storage.deleteFile(APPWRITE_BUCKET_PROFILE_PICTURES, fileId);
  } catch (error) {
    console.error('Failed to delete profile picture:', error);
    throw error;
  }
}

export async function getProfilePictureUrl(fileId: string): Promise<string> {
  return storage
    .getFilePreview(APPWRITE_BUCKET_PROFILE_PICTURES, fileId)
    .toString();
}

export async function getUserPublicProfile(userId: string): Promise<Users | null> {
  try {
    const response = await fetch(`/api/user-profile/${userId}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return null;
  }
}

export async function searchUsers(query: string): Promise<Users[]> {
  if (!query.trim()) return [];

  try {
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Failed to search users:', error);
    return [];
  }
}

export async function pickProfilePicture(): Promise<DocumentPicker.DocumentPickerAsset | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
    });

    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to pick profile picture:', error);
    return null;
  }
}
