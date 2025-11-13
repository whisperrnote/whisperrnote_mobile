import { tablesDB, Query, APPWRITE_DATABASE_ID, APPWRITE_TABLE_ID_SUBSCRIPTIONS } from './core';
import type { Subscriptions, SubscriptionsPlan } from '@/types/appwrite.d.ts';
import { getCurrentUser } from './auth';

export async function getSubscription(): Promise<Subscriptions | null> {
  try {
    const user = await getCurrentUser();
    if (!user?.$id) return null;

    const res = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_TABLE_ID_SUBSCRIPTIONS,
      queries: [Query.equal('userId', user.$id), Query.limit(1)] as any
    });

    if (res.rows.length > 0) {
      return res.rows[0] as unknown as Subscriptions;
    }
    return null;
  } catch (error) {
    console.error('Failed to get subscription:', error);
    return null;
  }
}

export async function checkPlanLimit(plan: SubscriptionsPlan, resource: string, currentCount: number): Promise<boolean> {
  const limits: Record<SubscriptionsPlan, Record<string, number>> = {
    free: {
      notes: 50,
      collaborators: 0,
      storage_mb: 100,
    },
    pro: {
      notes: 5000,
      collaborators: 10,
      storage_mb: 5000,
    },
    org: {
      notes: 50000,
      collaborators: 100,
      storage_mb: 50000,
    },
  };

  const limit = limits[plan]?.[resource] || 0;
  return currentCount < limit;
}

export const PLAN_FEATURES = {
  free: {
    name: 'Free',
    price: '$0',
    notes: 'Up to 50 notes',
    collaborators: 'No collaboration',
    storage: '100 MB',
  },
  pro: {
    name: 'Pro',
    price: '$9.99/month',
    notes: 'Up to 5,000 notes',
    collaborators: 'Up to 10 collaborators',
    storage: '5 GB',
  },
  org: {
    name: 'Organization',
    price: 'Custom',
    notes: 'Unlimited notes',
    collaborators: 'Up to 100 collaborators',
    storage: '50 GB',
  },
};
