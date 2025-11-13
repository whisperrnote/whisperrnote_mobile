import { getAllNotes } from './notes';
import { getTags } from './tags';
import { getCurrentUser } from './auth';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export interface ExportData {
  version: string;
  exportedAt: string;
  userId: string;
  notes: any[];
  tags: any[];
  metadata: {
    totalNotes: number;
    totalTags: number;
  };
}

export async function exportNotesAsJSON(): Promise<ExportData | null> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const notesResult = await getAllNotes();
    const tags = await getTags();

    const exportData: ExportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      userId: user.$id,
      notes: notesResult.documents,
      tags,
      metadata: {
        totalNotes: notesResult.documents.length,
        totalTags: tags.length,
      },
    };

    return exportData;
  } catch (error) {
    console.error('Failed to export notes:', error);
    return null;
  }
}

export async function exportNotesAsMarkdown(): Promise<string | null> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const notesResult = await getAllNotes();

    let markdown = `# WhisperNote Export\n\n`;
    markdown += `**Exported:** ${new Date().toLocaleString()}\n`;
    markdown += `**Total Notes:** ${notesResult.documents.length}\n\n`;
    markdown += `---\n\n`;

    for (const note of notesResult.documents) {
      markdown += `## ${note.title || 'Untitled Note'}\n\n`;
      markdown += `**Created:** ${new Date(note.createdAt || new Date()).toLocaleString()}\n`;
      markdown += `**Updated:** ${new Date(note.updatedAt || new Date()).toLocaleString()}\n`;

      if (note.tags && note.tags.length > 0) {
        markdown += `**Tags:** ${note.tags.join(', ')}\n`;
      }

      markdown += `\n${note.content}\n\n`;
      markdown += `---\n\n`;
    }

    return markdown;
  } catch (error) {
    console.error('Failed to export notes as markdown:', error);
    return null;
  }
}

export async function exportNotesAsCSV(): Promise<string | null> {
  try {
    const notesResult = await getAllNotes();

    let csv = `Title,Content,Tags,Created At,Updated At,Status\n`;

    for (const note of notesResult.documents) {
      const title = (note.title || '').replace(/"/g, '""');
      const content = (note.content || '').replace(/"/g, '""');
      const tags = (note.tags?.join('; ') || '').replace(/"/g, '""');
      const createdAt = new Date(note.createdAt || new Date()).toISOString();
      const updatedAt = new Date(note.updatedAt || new Date()).toISOString();
      const status = note.status || 'draft';

      csv += `"${title}","${content}","${tags}","${createdAt}","${updatedAt}","${status}"\n`;
    }

    return csv;
  } catch (error) {
    console.error('Failed to export notes as CSV:', error);
    return null;
  }
}

export async function importNotesFromJSON(jsonData: string): Promise<number> {
  try {
    const data: ExportData = JSON.parse(jsonData);

    // Validate export data structure
    if (!data.notes || !Array.isArray(data.notes)) {
      throw new Error('Invalid export format');
    }

    let importedCount = 0;

    // Import would depend on your backend implementation
    // This is a placeholder for the logic
    for (const note of data.notes) {
      try {
        // Import note - implement based on your needs
        importedCount++;
      } catch {
        // Continue with next note on error
      }
    }

    return importedCount;
  } catch (error) {
    console.error('Failed to import notes:', error);
    return 0;
  }
}

export async function pickJSONFile(): Promise<DocumentPicker.DocumentPickerAsset | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
    });

    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to pick JSON file:', error);
    return null;
  }
}

export async function saveExportToFile(data: string, filename: string): Promise<string | null> {
  try {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, data);
    return fileUri;
  } catch (error) {
    console.error('Failed to save export to file:', error);
    return null;
  }
}

export async function requestDataExport(): Promise<string> {
  try {
    const response = await fetch('/api/export/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Export request failed');
    const data = await response.json();
    return data.jobId;
  } catch (error) {
    console.error('Failed to request data export:', error);
    throw error;
  }
}

export async function getExportStatus(jobId: string): Promise<'pending' | 'processing' | 'completed' | 'failed'> {
  try {
    const response = await fetch(`/api/export/status/${jobId}`);
    if (!response.ok) throw new Error('Failed to get export status');
    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error('Failed to get export status:', error);
    throw error;
  }
}
