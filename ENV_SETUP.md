# WhisperNote Mobile - Environment Configuration Guide

This file documents all required environment variables for the WhisperNote mobile application.

## Appwrite Configuration

### Endpoint & Project
- `EXPO_PUBLIC_APPWRITE_ENDPOINT`: Appwrite server endpoint (e.g., https://fra.cloud.appwrite.io/v1)
- `EXPO_PUBLIC_APPWRITE_PROJECT_ID`: Your Appwrite project ID

### Database
- `EXPO_PUBLIC_APPWRITE_DATABASE_ID`: Appwrite database ID containing all tables

### Table IDs (Using Appwrite TablesDB)
All new tables should use the Appwrite TablesDB API for better scalability and performance.

#### Core Tables
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_USERS`: Users table
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_NOTES`: Notes table (main content)
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_TAGS`: Tags table
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_COMMENTS`: Comments on notes
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_REACTIONS`: Emoji reactions

#### Pivot/Supporting Tables
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_NOTETAGS`: Note-to-Tag mapping (pivot table)
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_NOTEREVISIONS`: Note revision history
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_COLLABORATORS`: Note collaboration/sharing
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_ACTIVITYLOG`: User activity logging

#### Admin/Subscription Tables
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_SUBSCRIPTIONS`: User subscription status
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_SETTINGS`: User settings
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_APIKEYS`: User API keys
- `EXPO_PUBLIC_APPWRITE_TABLE_ID_EXTENSIONS`: Extension management

### Storage Buckets
- `EXPO_PUBLIC_APPWRITE_BUCKET_PROFILE_PICTURES`: User profile pictures
- `EXPO_PUBLIC_APPWRITE_BUCKET_NOTES_ATTACHMENTS`: Note attachments (images, files)
- `EXPO_PUBLIC_APPWRITE_BUCKET_EXTENSION_ASSETS`: Extension assets
- `EXPO_PUBLIC_APPWRITE_BUCKET_BACKUPS`: User data backups
- `EXPO_PUBLIC_APPWRITE_BUCKET_TEMP_UPLOADS`: Temporary file uploads

## App Configuration
- `EXPO_PUBLIC_APP_URI`: Deep link URI for your app (e.g., whisperrnote://)

## Features Not Yet Implemented in Mobile

The following features from the web app are available as library functions but don't have UI yet:

1. **AI Integration** - Text generation, summarization
2. **Wallet Authentication** - Web3 login via Solana/ICP
3. **WebAuthn/Passkeys** - Biometric authentication
4. **Admin Dashboard** - User management, analytics
5. **Extensions** - Third-party integrations
6. **File Attachments** - Full file upload/download UI
7. **Subscription Management** - Payment processing UI
8. **Advanced Collaborators** - Real-time collaboration

## Setup Instructions

1. Copy `.env.example` to `.env.local`
2. Fill in your Appwrite credentials
3. Ensure all table IDs match your Appwrite setup
4. Use `expo start` to run the app

## Notes on TablesDB Migration

This mobile app uses Appwrite's newer TablesDB API instead of the deprecated Collections API.
This provides:
- Better scalability for production use
- SQL-like query interface
- Improved performance for large datasets
- Native pagination support
