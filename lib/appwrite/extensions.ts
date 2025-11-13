import { tablesDB, ID, Query, APPWRITE_DATABASE_ID, Permission, Role } from './core';
import { getCurrentUser } from './auth';
import type { Extensions } from '@whisperrnote_mobile/types/appwrite.d.ts';

const APPWRITE_TABLE_ID_EXTENSIONS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_EXTENSIONS || 'extensions';

export async function createExtension(data: {
  name: string;
  description?: string;
  icon?: string;
  url?: string;
  metadata?: Record<string, any>;
}): Promise<Extensions> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const now = new Date().toISOString();
  const permissions = [
    Permission.read(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id)),
  ];

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_EXTENSIONS,
    rowId: ID.unique(),
    data: {
      name: data.name,
      description: data.description || null,
      icon: data.icon || null,
      url: data.url || null,
      metadata: JSON.stringify(data.metadata || {}),
      createdAt: now,
      updatedAt: now,
    },
    permissions,
  });

  return doc as unknown as Extensions;
}

export async function getExtensions(): Promise<Extensions[]> {
  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_EXTENSIONS,
      queries: [Query.limit(100)] as any,
    });

    return res.rows as unknown as Extensions[];
  } catch (error) {
    console.error('Failed to fetch extensions:', error);
    return [];
  }
}

export async function getExtension(extensionId: string): Promise<Extensions | null> {
  try {
    const doc = await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_EXTENSIONS,
      rowId: extensionId,
    });

    return doc as unknown as Extensions;
  } catch (error) {
    console.error('Failed to fetch extension:', error);
    return null;
  }
}

export async function updateExtension(
  extensionId: string,
  data: Partial<{
    name: string;
    description: string;
    icon: string;
    url: string;
    metadata: Record<string, any>;
  }>
): Promise<Extensions> {
  const updateData: Record<string, any> = {};

  if (data.name) updateData.name = data.name;
  if (data.description) updateData.description = data.description;
  if (data.icon) updateData.icon = data.icon;
  if (data.url) updateData.url = data.url;
  if (data.metadata) updateData.metadata = JSON.stringify(data.metadata);

  updateData.updatedAt = new Date().toISOString();

  const doc = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_EXTENSIONS,
    rowId: extensionId,
    data: updateData,
  });

  return doc as unknown as Extensions;
}

export async function deleteExtension(extensionId: string): Promise<void> {
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_EXTENSIONS,
    rowId: extensionId,
  });
}

export async function installExtension(extensionId: string): Promise<any> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const response = await fetch('/api/extensions/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.$id,
        extensionId,
      }),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to install extension:', error);
    throw error;
  }
}

export async function uninstallExtension(extensionId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    await fetch('/api/extensions/uninstall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.$id,
        extensionId,
      }),
    });
  } catch (error) {
    console.error('Failed to uninstall extension:', error);
    throw error;
  }
}
