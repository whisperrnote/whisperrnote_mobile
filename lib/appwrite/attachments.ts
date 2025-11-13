import { storage, APPWRITE_BUCKET_NOTES_ATTACHMENTS, ID } from './core';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export async function uploadAttachment(noteId: string, file: DocumentPicker.DocumentPickerAsset) {
  try {
    if (!file.uri) throw new Error('No file URI');

    // Read file as base64
    const fileContent = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to blob
    const binaryString = atob(fileContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: file.mimeType || 'application/octet-stream' });

    // Upload to Appwrite
    const fileId = ID.unique();
    const response = await storage.createFile(
      APPWRITE_BUCKET_NOTES_ATTACHMENTS,
      fileId,
      blob as any
    );

    return response;
  } catch (error) {
    console.error('Failed to upload attachment:', error);
    throw error;
  }
}

export async function deleteAttachment(fileId: string) {
  try {
    return await storage.deleteFile(APPWRITE_BUCKET_NOTES_ATTACHMENTS, fileId);
  } catch (error) {
    console.error('Failed to delete attachment:', error);
    throw error;
  }
}

export function getAttachmentUrl(fileId: string): string {
  return storage.getFilePreview(
    APPWRITE_BUCKET_NOTES_ATTACHMENTS,
    fileId
  ).toString();
}

export async function pickFile() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      multiple: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to pick file:', error);
    throw error;
  }
}
