import { tablesDB, ID, Query, APPWRITE_DATABASE_ID } from './core';
import { getCurrentUser } from './auth';
import type { Posts } from '@whisperrnote_mobile/types/appwrite.d.ts';

const APPWRITE_TABLE_ID_POSTS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_POSTS || 'posts';

export async function createPost(data: {
  content: string;
  contentType: 'text' | 'image' | 'video' | 'audio' | 'poll' | 'article';
  mediaUrls?: string[];
  mediaFileIds?: string[];
  hashtags?: string[];
  mentions?: string[];
  privacy: 'public' | 'friends' | 'private' | 'custom';
  allowComments?: boolean;
  allowShares?: boolean;
}): Promise<Posts> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const now = new Date().toISOString();

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_POSTS,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      content: data.content,
      contentType: data.contentType,
      mediaUrls: data.mediaUrls || [],
      mediaFileIds: data.mediaFileIds || [],
      hashtags: data.hashtags || [],
      mentions: data.mentions || [],
      privacy: data.privacy,
      allowComments: data.allowComments !== false,
      allowShares: data.allowShares !== false,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    },
  });

  return doc as unknown as Posts;
}

export async function getPosts(limit: number = 20): Promise<Posts[]> {
  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_POSTS,
      queries: [Query.orderDesc('createdAt'), Query.limit(limit)] as any,
    });

    return res.rows as unknown as Posts[];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export async function getPost(postId: string): Promise<Posts | null> {
  try {
    const doc = await tablesDB.getRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_POSTS,
      rowId: postId,
    });

    return doc as unknown as Posts;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export async function updatePost(
  postId: string,
  data: Partial<{
    content: string;
    privacy: string;
    allowComments: boolean;
    allowShares: boolean;
  }>
): Promise<Posts> {
  const doc = await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_POSTS,
    rowId: postId,
    data: {
      ...data,
      updatedAt: new Date().toISOString(),
    },
  });

  return doc as unknown as Posts;
}

export async function deletePost(postId: string): Promise<void> {
  await tablesDB.deleteRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_POSTS,
    rowId: postId,
  });
}

export async function getUserPosts(userId: string, limit: number = 20): Promise<Posts[]> {
  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_POSTS,
      queries: [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
      ] as any,
    });

    return res.rows as unknown as Posts[];
  } catch (error) {
    console.error('Failed to fetch user posts:', error);
    return [];
  }
}

export async function incrementPostView(postId: string): Promise<void> {
  try {
    const post = await getPost(postId);
    if (!post) return;

    await tablesDB.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_POSTS,
      rowId: postId,
      data: { viewCount: (post.viewCount || 0) + 1 },
    });
  } catch (error) {
    console.error('Failed to increment post view:', error);
  }
}

export async function pinPost(postId: string): Promise<void> {
  await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_POSTS,
    rowId: postId,
    data: { isPinned: true },
  });
}

export async function unpinPost(postId: string): Promise<void> {
  await tablesDB.updateRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_POSTS,
    rowId: postId,
    data: { isPinned: false },
  });
}

export async function getFeedByHashtag(hashtag: string, limit: number = 20): Promise<Posts[]> {
  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_POSTS,
      queries: [
        Query.search('hashtags', hashtag),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
      ] as any,
    });

    return res.rows as unknown as Posts[];
  } catch (error) {
    console.error('Failed to fetch posts by hashtag:', error);
    return [];
  }
}

export async function getTrendingPosts(limit: number = 10): Promise<Posts[]> {
  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_POSTS,
      queries: [Query.orderDesc('likeCount'), Query.limit(limit)] as any,
    });

    return res.rows as unknown as Posts[];
  } catch (error) {
    console.error('Failed to fetch trending posts:', error);
    return [];
  }
}
