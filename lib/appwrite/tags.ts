import { tablesDB, ID, Query, APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID_TAGS } from './core';
import type { Tags } from '@/types/appwrite';
import { getCurrentUser } from './auth';

export async function getTags(): Promise<Tags[]> {
  const user = await getCurrentUser();
  if (!user?.$id) return [];
  
  const res = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_TAGS,
    queries: [Query.equal('userId', user.$id), Query.orderDesc('usageCount'), Query.limit(1000)] as any
  });
  
  return res.rows as unknown as Tags[];
}

export async function getTag(tagId: string): Promise<Tags> {
  const doc = await tablesDB.getRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_TAGS,
    rowId: tagId
  });
  
  return doc as unknown as Tags;
}

export async function createTag(name: string): Promise<Tags> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');
  
  const nameLower = name.toLowerCase();
  const now = new Date().toISOString();
  
  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_TAGS,
    rowId: ID.unique(),
    data: {
      name,
      nameLower,
      userId: user.$id,
      usageCount: 0,
      createdAt: now
    }
  });
  
  return doc as unknown as Tags;
}

export async function updateTag(tagId: string, data: Partial<Tags>) {
  const doc = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_TAGS,
    rowId: tagId,
    data
  });
  
  return doc as unknown as Tags;
}

export async function deleteTag(tagId: string) {
  return tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_TAGS,
    rowId: tagId
  });
}
