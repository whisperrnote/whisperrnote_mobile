import { Query, APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID_NOTES, tablesDB } from './core';
import type { Notes } from '@/types/appwrite';

export async function searchNotes(query: string): Promise<Notes[]> {
  if (!query.trim()) return [];

  try {
    const searchTerm = `%${query}%`;
    const results = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_NOTES,
      queries: [
        Query.search('title', searchTerm),
        Query.limit(50)
      ] as any
    });

    return results.rows as unknown as Notes[];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

export async function searchNotesByContent(content: string): Promise<Notes[]> {
  if (!content.trim()) return [];

  try {
    const searchTerm = `%${content}%`;
    const results = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_NOTES,
      queries: [
        Query.search('content', searchTerm),
        Query.limit(50)
      ] as any
    });

    return results.rows as unknown as Notes[];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}
