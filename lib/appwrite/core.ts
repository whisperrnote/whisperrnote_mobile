import { Client, Account, Databases, Storage, Functions, ID, Query, Permission, Role, TablesDB } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '67fe9627001d97e37ef3');

const account = new Account(client);
const databases = new Databases(client);
const tablesDB = new TablesDB(client);
const storage = new Storage(client);
const functions = new Functions(client);

// App URI for redirects
export const APP_URI = process.env.EXPO_PUBLIC_APP_URI || 'whisperrnote://';

// Database & Collection IDs
export const APPWRITE_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '67ff05a9000296822396';
export const APPWRITE_TABLE_ID_USERS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_USERS || '67ff05c900247b5673d3';
export const APPWRITE_TABLE_ID_NOTES = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_NOTES || '67ff05f3002502ef239e';
export const APPWRITE_TABLE_ID_TAGS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_TAGS || '67ff06280034908cf08a';
export const APPWRITE_TABLE_ID_APIKEYS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_APIKEYS || '67ff064400263631ffe4';
export const APPWRITE_TABLE_ID_COMMENTS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_COMMENTS || 'comments';
export const APPWRITE_TABLE_ID_EXTENSIONS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_EXTENSIONS || 'extensions';
export const APPWRITE_TABLE_ID_REACTIONS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_REACTIONS || 'reactions';
export const APPWRITE_TABLE_ID_COLLABORATORS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_COLLABORATORS || 'collaborators';
export const APPWRITE_TABLE_ID_ACTIVITYLOG = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_ACTIVITYLOG || 'activityLog';
export const APPWRITE_TABLE_ID_SETTINGS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_SETTINGS || 'settings';
export const APPWRITE_TABLE_ID_SUBSCRIPTIONS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_SUBSCRIPTIONS || 'subscriptions';
export const APPWRITE_TABLE_ID_NOTETAGS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_NOTETAGS || 'note_tags';
export const APPWRITE_TABLE_ID_NOTEREVISIONS = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID_NOTEREVISIONS || 'note_revisions';

// Buckets
export const APPWRITE_BUCKET_PROFILE_PICTURES = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_PROFILE_PICTURES || 'profile_pictures';
export const APPWRITE_BUCKET_NOTES_ATTACHMENTS = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_NOTES_ATTACHMENTS || 'notes_attachments';
export const APPWRITE_BUCKET_EXTENSION_ASSETS = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_EXTENSION_ASSETS || 'extension_assets';
export const APPWRITE_BUCKET_BACKUPS = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_BACKUPS || 'backups';
export const APPWRITE_BUCKET_TEMP_UPLOADS = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_TEMP_UPLOADS || 'temp_uploads';

export {
  client,
  account,
  databases,
  tablesDB,
  storage,
  functions,
  ID,
  Query,
  Permission,
  Role,
};
