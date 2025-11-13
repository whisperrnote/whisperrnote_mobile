import { tablesDB, ID, Query, APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID_COMMENTS } from './core';
import type { Comments } from '@/types/appwrite';
import { getCurrentUser } from './auth';

export async function createComment(noteId: string, content: string): Promise<Comments> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');
  
  const now = new Date().toISOString();
  
  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_COMMENTS,
    rowId: ID.unique(),
    data: {
      noteId,
      userId: user.$id,
      content,
      createdAt: now
    }
  });
  
  return doc as unknown as Comments;
}

export async function getComment(commentId: string): Promise<Comments> {
  const doc = await tablesDB.getRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_COMMENTS,
    rowId: commentId
  });
  
  return doc as unknown as Comments;
}

export async function updateComment(commentId: string, content: string): Promise<Comments> {
  const doc = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_COMMENTS,
    rowId: commentId,
    data: { content }
  });
  
  return doc as unknown as Comments;
}

export async function deleteComment(commentId: string) {
  return tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_COMMENTS,
    rowId: commentId
  });
}

export async function listNoteComments(noteId: string, limit: number = 100): Promise<{ documents: Comments[]; total: number }> {
  const res = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_COMMENTS,
    queries: [Query.equal('noteId', noteId), Query.orderDesc('$createdAt'), Query.limit(limit)] as any
  });
  
  return { documents: res.rows as unknown as Comments[], total: res.total };
}
