import { account, ID, OAuthProvider } from './core';
import type { Users } from '@/types/appwrite.d.ts';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

export async function signupEmailPassword(email: string, password: string, name: string) {
  return account.create(ID.unique(), email, password, name);
}

export async function loginEmailPassword(email: string, password: string) {
  return account.createEmailPasswordSession(email, password);
}

export async function loginWithOAuth(provider: OAuthProvider) {
  try {
    // Create deep link that works across Expo environments
    const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
    const scheme = `${deepLink.protocol}//`;

    // Start OAuth flow - create the token/login URL
    const loginUrl = await account.createOAuth2Token({
      provider,
      success: deepLink.toString(),
      failure: deepLink.toString(),
    });

    if (!loginUrl) throw new Error('Failed to create OAuth2 token');

    // Open login URL in browser
    const result = await WebBrowser.openAuthSessionAsync(loginUrl, scheme);

    if (result.type !== 'success') {
      throw new Error('OAuth authentication canceled');
    }

    // Extract credentials from OAuth redirect URL
    const url = new URL(result.url);
    const secret = url.searchParams.get('secret');
    const userId = url.searchParams.get('userId');

    if (!secret || !userId) {
      throw new Error('Invalid OAuth response - missing credentials');
    }

    // Create session with OAuth credentials
    await account.createSession({
      userId,
      secret,
    });

    return { $id: userId } as unknown as Users;
  } catch (error) {
    console.error(`${provider} login failed:`, error);
    throw error;
  }
}

export async function logout() {
  return account.deleteSession('current');
}

export async function getCurrentUser(): Promise<Users | null> {
  try {
    return await account.get() as unknown as Users;
  } catch {
    return null;
  }
}

export async function getOAuthSession() {
  try {
    const session = await account.getSession('current');
    return {
      provider: session.provider,
      providerUid: session.providerUid,
      providerAccessToken: session.providerAccessToken,
      providerAccessTokenExpiry: session.providerAccessTokenExpiry,
    };
  } catch (error) {
    console.error('Failed to get OAuth session:', error);
    return null;
  }
}

export async function refreshOAuthSession() {
  try {
    const session = await account.getSession('current');
    
    // Check if token is about to expire (within 5 minutes)
    if (session.providerAccessTokenExpiry) {
      const expiryTime = new Date(session.providerAccessTokenExpiry).getTime();
      const now = new Date().getTime();
      const fiveMinutes = 5 * 60 * 1000;

      if (expiryTime - now < fiveMinutes) {
        await account.updateSession({
          sessionId: 'current',
        });
      }
    }
  } catch (error) {
    console.error('Failed to refresh OAuth session:', error);
  }
}

export async function sendEmailVerification(redirectUrl: string) {
  return account.createVerification(redirectUrl);
}

export async function completeEmailVerification(userId: string, secret: string) {
  return account.updateVerification(userId, secret);
}

export async function getEmailVerificationStatus(): Promise<boolean> {
  try {
    const user = await account.get();
    return !!user.emailVerification;
  } catch {
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, redirectUrl: string) {
  return account.createRecovery(email, redirectUrl);
}

export async function completePasswordReset(userId: string, secret: string, password: string) {
  return account.updateRecovery(userId, secret, password);
}
