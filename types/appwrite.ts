export enum Status {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum TargetType {
  NOTE = 'note',
  COMMENT = 'comment'
}

export enum Permission {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

export type SubscriptionPlan = 'free' | 'pro' | 'org';
export type SubscriptionStatus = 'active' | 'canceled' | 'trialing';

export interface Users {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  email: string;
  name: string;
  emailVerification?: boolean;
  prefs?: Record<string, any>;
}

export interface Notes {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  id: string;
  userId: string;
  title: string;
  content: string;
  tags?: string[];
  status: Status;
  isPublic?: boolean;
  collaborators?: string[];
  attachments?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Tags {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  name: string;
  nameLower: string;
  userId: string;
  usageCount: number;
}

export interface Comments {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  noteId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Reactions {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  targetType: TargetType;
  targetId: string;
  userId: string;
  emoji: string;
}

export interface Extensions {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  name: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface Collaborators {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  noteId: string;
  userId: string;
  role: 'viewer' | 'editor' | 'admin';
  inviteEmail?: string;
}

export interface NoteTagPivot {
  $id: string;
  noteId: string;
  tagId: string | null;
  tag: string | null;
  userId: string | null;
  createdAt: string | null;
}

export interface NoteRevision {
  $id: string;
  noteId: string;
  revision: number;
  userId: string | null;
  createdAt: string;
  title: string | null;
  content: string | null;
  diff: string | null;
  diffFormat: 'json' | null;
  fullSnapshot: boolean | null;
  cause: string | null;
}

export interface Subscription {
  $id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  seats: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiKeys {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  userId: string;
  name: string;
  key: string;
  lastUsed?: string;
}

export interface ActivityLog {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  userId: string;
  action: string;
  resourceId: string;
  metadata?: Record<string, any>;
}

export interface Settings {
  $id: string;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  userId: string;
  key: string;
  value: any;
}
