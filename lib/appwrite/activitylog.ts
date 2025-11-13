import { tablesDB, ID, Query, APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID_ACTIVITYLOG } from './core';
import type { ActivityLog } from '@/types/appwrite';
import { getCurrentUser } from './auth';

export async function logActivity(
  action: string,
  resourceId: string,
  metadata?: Record<string, any>
): Promise<ActivityLog> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_ACTIVITYLOG,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      action,
      resourceId,
      metadata: metadata || {},
    }
  });

  return doc as unknown as ActivityLog;
}

export async function getUserActivityLog(limit: number = 50): Promise<ActivityLog[]> {
  const user = await getCurrentUser();
  if (!user?.$id) return [];

  const res = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_ACTIVITYLOG,
    queries: [Query.equal('userId', user.$id), Query.orderDesc('$createdAt'), Query.limit(limit)] as any
  });

  return res.rows as unknown as ActivityLog[];
}
