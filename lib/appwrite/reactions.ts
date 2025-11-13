import { tablesDB, ID, Query, APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID_REACTIONS } from './core';
import type { Reactions, TargetType } from '@/types/appwrite';
import { getCurrentUser } from './auth';

export async function addReaction(targetType: TargetType, targetId: string, emoji: string): Promise<Reactions> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_REACTIONS,
    rowId: ID.unique(),
    data: {
      targetType,
      targetId,
      userId: user.$id,
      emoji,
    }
  });

  return doc as unknown as Reactions;
}

export async function removeReaction(reactionId: string) {
  return tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_REACTIONS,
    rowId: reactionId
  });
}

export async function getReactionsForTarget(targetType: TargetType, targetId: string): Promise<Reactions[]> {
  const res = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_REACTIONS,
    queries: [
      Query.equal('targetType', targetType),
      Query.equal('targetId', targetId),
      Query.limit(1000)
    ] as any
  });

  return res.rows as unknown as Reactions[];
}
