import { tablesDB, ID, Query, APPWRITE_DATABASE_ID } from './core';
import { getCurrentUser } from './auth';
import type { Messages, Conversations } from '@whisperrnote_mobile/types/appwrite.d.ts';

const APPWRITE_TABLE_ID_MESSAGES = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_MESSAGES || 'messages';
const APPWRITE_TABLE_ID_CONVERSATIONS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_CONVERSATIONS || 'conversations';

export async function createConversation(data: {
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  participantIds: string[];
}): Promise<Conversations> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const now = new Date().toISOString();

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_CONVERSATIONS,
    rowId: ID.unique(),
    data: {
      type: data.type,
      name: data.name || null,
      description: data.description || null,
      creatorId: user.$id,
      participantIds: [user.$id, ...data.participantIds],
      adminIds: [user.$id],
      moderatorIds: [user.$id],
      participantCount: data.participantIds.length + 1,
      createdAt: now,
      updatedAt: now,
    },
  });

  return doc as unknown as Conversations;
}

export async function getConversations(): Promise<Conversations[]> {
  const user = await getCurrentUser();
  if (!user?.$id) return [];

  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_CONVERSATIONS,
      queries: [Query.orderDesc('lastMessageAt'), Query.limit(50)] as any,
    });

    return res.rows as unknown as Conversations[];
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return [];
  }
}

export async function getConversation(conversationId: string): Promise<Conversations | null> {
  try {
    const doc = await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_CONVERSATIONS,
      rowId: conversationId,
    });

    return doc as unknown as Conversations;
  } catch (error) {
    console.error('Failed to fetch conversation:', error);
    return null;
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
  contentType: 'text' | 'image' | 'file' = 'text'
): Promise<Messages> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const now = new Date().toISOString();

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_MESSAGES,
    rowId: ID.unique(),
    data: {
      conversationId,
      senderId: user.$id,
      content,
      contentType,
      status: 'sent',
      createdAt: now,
    },
  });

  return doc as unknown as Messages;
}

export async function getMessages(
  conversationId: string,
  limit: number = 50
): Promise<Messages[]> {
  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_MESSAGES,
      queries: [
        Query.equal('conversationId', conversationId),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
      ] as any,
    });

    return res.rows as unknown as Messages[];
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}

export async function editMessage(messageId: string, content: string): Promise<Messages> {
  const doc = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_MESSAGES,
    rowId: messageId,
    data: { content, updatedAt: new Date().toISOString() },
  });

  return doc as unknown as Messages;
}

export async function deleteMessage(messageId: string): Promise<void> {
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_MESSAGES,
    rowId: messageId,
  });
}

export async function markAsRead(messageId: string): Promise<void> {
  await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_MESSAGES,
    rowId: messageId,
    data: { status: 'read' },
  });
}

export async function addConversationParticipant(
  conversationId: string,
  userId: string
): Promise<void> {
  const conversation = await getConversation(conversationId);
  if (!conversation) throw new Error('Conversation not found');

  const participantIds = conversation.participantIds || [];
  if (!participantIds.includes(userId)) {
    participantIds.push(userId);
  }

  await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_CONVERSATIONS,
    rowId: conversationId,
    data: {
      participantIds,
      participantCount: (participantIds.length),
    },
  });
}

export async function removeConversationParticipant(
  conversationId: string,
  userId: string
): Promise<void> {
  const conversation = await getConversation(conversationId);
  if (!conversation) throw new Error('Conversation not found');

  const participantIds = (conversation.participantIds || []).filter((id) => id !== userId);

  await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_CONVERSATIONS,
    rowId: conversationId,
    data: {
      participantIds,
      participantCount: participantIds.length,
    },
  });
}
