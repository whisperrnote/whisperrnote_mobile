import { account, ID } from './core';

export interface PasskeyRegistrationOptions {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: 'public-key';
    alg: number;
  }>;
  timeout: number;
  attestation: 'none' | 'direct' | 'indirect';
  authenticatorSelection: {
    authenticatorAttachment: 'platform' | 'cross-platform';
    residentKey: 'discouraged' | 'preferred' | 'required';
    userVerification: 'preferred' | 'required' | 'discouraged';
  };
}

export interface PasskeyAuthenticationOptions {
  challenge: string;
  timeout: number;
  rpId: string;
  allowCredentials: Array<{
    type: 'public-key';
    id: string;
    transports?: string[];
  }>;
  userVerification: 'preferred' | 'required' | 'discouraged';
}

export async function generatePasskeyRegistrationOptions(
  email: string,
  name: string
): Promise<PasskeyRegistrationOptions> {
  try {
    const response = await fetch('/api/auth/passkey/generate-registration-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to generate passkey registration options:', error);
    throw error;
  }
}

export async function verifyPasskeyRegistration(
  email: string,
  credential: any
): Promise<any> {
  try {
    const response = await fetch('/api/auth/passkey/verify-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, credential }),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to verify passkey registration:', error);
    throw error;
  }
}

export async function generatePasskeyAuthenticationOptions(
  email: string
): Promise<PasskeyAuthenticationOptions> {
  try {
    const response = await fetch('/api/auth/passkey/generate-authentication-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to generate passkey authentication options:', error);
    throw error;
  }
}

export async function verifyPasskeyAuthentication(
  email: string,
  credential: any
): Promise<any> {
  try {
    const response = await fetch('/api/auth/passkey/verify-authentication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, credential }),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to verify passkey authentication:', error);
    throw error;
  }
}
