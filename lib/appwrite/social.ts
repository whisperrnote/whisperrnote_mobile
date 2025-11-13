import { tablesDB, ID, Query, APPWRITE_DATABASE_ID } from './core';
import { getCurrentUser } from './auth';
import type { Follows, Contacts, TokenHoldings, Wallets } from '@/types/appwrite.d.ts';

const APPWRITE_TABLE_ID_FOLLOWS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_FOLLOWS || 'follows';
const APPWRITE_TABLE_ID_CONTACTS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_CONTACTS || 'contacts';
const APPWRITE_TABLE_ID_TOKEN_HOLDINGS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_TOKEN_HOLDINGS || 'token_holdings';
const APPWRITE_TABLE_ID_WALLETS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_WALLETS || 'wallets';

// Follow System
export async function followUser(userId: string): Promise<Follows> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_FOLLOWS,
    rowId: ID.unique(),
    data: {
      followerId: user.$id,
      followingId: userId,
      status: 'accepted',
      createdAt: new Date().toISOString(),
    },
  });

  return doc as unknown as Follows;
}

export async function unfollowUser(userId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_FOLLOWS,
      queries: [
        Query.equal('followerId', user.$id),
        Query.equal('followingId', userId),
        Query.limit(1),
      ] as any,
    });

    if (res.rows.length > 0) {
      await tablesDB.deleteRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_TABLE_ID_FOLLOWS,
        rowId: (res.rows[0] as any).$id,
      });
    }
  } catch (error) {
    console.error('Failed to unfollow user:', error);
  }
}

export async function getFollowers(userId: string, limit: number = 50): Promise<Follows[]> {
  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_FOLLOWS,
      queries: [
        Query.equal('followingId', userId),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
      ] as any,
    });

    return res.rows as unknown as Follows[];
  } catch (error) {
    console.error('Failed to fetch followers:', error);
    return [];
  }
}

export async function getFollowing(userId: string, limit: number = 50): Promise<Follows[]> {
  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_FOLLOWS,
      queries: [
        Query.equal('followerId', userId),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
      ] as any,
    });

    return res.rows as unknown as Follows[];
  } catch (error) {
    console.error('Failed to fetch following:', error);
    return [];
  }
}

// Contacts
export async function addContact(
  contactUserId: string,
  relationship: 'friend' | 'family' | 'colleague' | 'acquaintance' = 'friend'
): Promise<Contacts> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_CONTACTS,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      contactUserId,
      relationship,
      isBlocked: false,
      isFavorite: false,
      addedAt: new Date().toISOString(),
    },
  });

  return doc as unknown as Contacts;
}

export async function getContacts(limit: number = 100): Promise<Contacts[]> {
  const user = await getCurrentUser();
  if (!user?.$id) return [];

  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_CONTACTS,
      queries: [Query.equal('userId', user.$id), Query.limit(limit)] as any,
    });

    return res.rows as unknown as Contacts[];
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return [];
  }
}

export async function blockUser(userId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_CONTACTS,
      queries: [
        Query.equal('userId', user.$id),
        Query.equal('contactUserId', userId),
        Query.limit(1),
      ] as any,
    });

    if (res.rows.length > 0) {
      await tablesDB.updateRow({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_TABLE_ID_CONTACTS,
        rowId: (res.rows[0] as any).$id,
        data: { isBlocked: true },
      });
    }
  } catch (error) {
    console.error('Failed to block user:', error);
  }
}

// Wallets & Crypto
export async function addWallet(data: {
  address: string;
  chain: string;
  walletType: 'metamask' | 'walletconnect' | 'phantom' | 'trust' | 'other';
  nickname?: string;
}): Promise<Wallets> {
  const user = await getCurrentUser();
  if (!user?.$id) throw new Error('User not authenticated');

  const doc = await tablesDB.createRow({
    databaseId: APPWRITE_DATABASE_ID,
    tableId: APPWRITE_TABLE_ID_WALLETS,
    rowId: ID.unique(),
    data: {
      userId: user.$id,
      address: data.address,
      chain: data.chain,
      walletType: data.walletType,
      isPrimary: false,
      nickname: data.nickname || null,
      isVerified: false,
      addedAt: new Date().toISOString(),
    },
  });

  return doc as unknown as Wallets;
}

export async function getWallets(): Promise<Wallets[]> {
  const user = await getCurrentUser();
  if (!user?.$id) return [];

  try {
    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_WALLETS,
      queries: [Query.equal('userId', user.$id)] as any,
    });

    return res.rows as unknown as Wallets[];
  } catch (error) {
    console.error('Failed to fetch wallets:', error);
    return [];
  }
}

export async function getTokenHoldings(): Promise<TokenHoldings[]> {
  const user = await getCurrentUser();
  if (!user?.$id) return [];

  try {
    const wallets = await getWallets();
    const walletAddresses = wallets.map((w) => w.address);

    if (walletAddresses.length === 0) return [];

    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_TOKEN_HOLDINGS,
      queries: [Query.equal('walletAddress', walletAddresses)] as any,
    });

    return res.rows as unknown as TokenHoldings[];
  } catch (error) {
    console.error('Failed to fetch token holdings:', error);
    return [];
  }
}
