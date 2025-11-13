import { tablesDB, ID, Query, APPWRITE_DATABASE_ID } from './core';
import { getCurrentUser } from './auth';
import type { ApiKeys } from '@/types/appwrite.d.ts';

const APPWRITE_TABLE_ID_APIKEYS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_APIKEYS || 'apikeys';

export async function createApiKey(name: string): Promise<ApiKeys> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const key = `sk_${ID.unique()}`;
  const now = new Date().toISOString();

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_APIKEYS,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      name,
      key,
      createdAt: now,
    },
  });

  return doc as unknown as ApiKeys;
}

export async function getApiKeys(): Promise<ApiKeys[]> {
  const user = await getCurrentUser();
  if (!user?.$id) return [];

  const res = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_APIKEYS,
    queries: [Query.equal('userId', user.$id), Query.limit(100)] as any,
  });

  return res.rows as unknown as ApiKeys[];
}

export async function getApiKey(keyId: string): Promise<ApiKeys> {
  const doc = await tablesDB.getRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_APIKEYS,
    rowId: keyId,
  });

  return doc as unknown as ApiKeys;
}

export async function updateApiKey(keyId: string, name: string): Promise<ApiKeys> {
  const doc = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_APIKEYS,
    rowId: keyId,
    data: { name },
  });

  return doc as unknown as ApiKeys;
}

export async function deleteApiKey(keyId: string): Promise<void> {
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_APIKEYS,
    rowId: keyId,
  });
}

export async function rotateApiKey(keyId: string): Promise<ApiKeys> {
  const newKey = `sk_${ID.unique()}`;
  const doc = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_APIKEYS,
    rowId: keyId,
    data: { key: newKey },
  });

  return doc as unknown as ApiKeys;
}

export async function createBearerToken(): Promise<string> {
  try {
    const response = await fetch('/api/auth/create-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Failed to create bearer token:', error);
    throw error;
  }
}
