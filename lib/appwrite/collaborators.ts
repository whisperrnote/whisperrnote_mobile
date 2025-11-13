import { tablesDB, ID, Query, APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID_COLLABORATORS, Permission, Role } from './core';
import type { Collaborators } from '@/types/appwrite';

export async function addCollaborator(
  noteId: string,
  email: string,
  role: 'viewer' | 'editor' | 'admin' = 'viewer'
): Promise<Collaborators> {
  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_COLLABORATORS,
    rowId: ID.unique(),
    data: {
      noteId,
      inviteEmail: email,
      role,
      userId: null,
    }
  });

  return doc as unknown as Collaborators;
}

export async function getCollaborators(noteId: string): Promise<Collaborators[]> {
  const res = await tablesDB.listRows({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_COLLABORATORS,
    queries: [Query.equal('noteId', noteId), Query.limit(100)] as any
  });

  return res.rows as unknown as Collaborators[];
}

export async function updateCollaborator(
  collaboratorId: string,
  role: 'viewer' | 'editor' | 'admin'
): Promise<Collaborators> {
  const doc = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_COLLABORATORS,
    rowId: collaboratorId,
    data: { role }
  });

  return doc as unknown as Collaborators;
}

export async function removeCollaborator(collaboratorId: string) {
  return tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_COLLABORATORS,
    rowId: collaboratorId
  });
}
