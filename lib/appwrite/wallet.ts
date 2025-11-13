import { getCurrentUser } from './auth';

export interface WalletSignMessage {
  address: string;
  chain: 'solana' | 'ethereum' | 'icp';
  message: string;
  nonce: string;
}

export interface WalletVerification {
  signature: string;
  publicKey: string;
  address: string;
  chain: string;
}

export async function requestWalletNonce(address: string, chain: string): Promise<string> {
  try {
    const response = await fetch('/api/auth/wallet/nonce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, chain }),
    });
    const data = await response.json();
    return data.nonce;
  } catch (error) {
    console.error('Failed to request wallet nonce:', error);
    throw error;
  }
}

export async function registerWallet(
  address: string,
  chain: string,
  signature: string,
  nonce: string
): Promise<any> {
  try {
    const response = await fetch('/api/auth/wallet/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, chain, signature, nonce }),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to register wallet:', error);
    throw error;
  }
}

export async function verifyWalletSignature(
  address: string,
  chain: string,
  signature: string,
  nonce: string
): Promise<any> {
  try {
    const response = await fetch('/api/auth/wallet/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, chain, signature, nonce }),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to verify wallet signature:', error);
    throw error;
  }
}

export async function getWalletMap(address: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/wallet-map?address=${address}`);
    const data = await response.json();
    return data.userId || null;
  } catch (error) {
    console.error('Failed to get wallet map:', error);
    return null;
  }
}

export async function linkWallet(
  address: string,
  chain: string,
  walletType: 'metamask' | 'walletconnect' | 'phantom' | 'trust'
): Promise<any> {
  try {
    const user = await getCurrentUser();
    if (!user?.$id) throw new Error('User not authenticated');

    const response = await fetch('/api/wallet-map', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.$id,
        address,
        chain,
        walletType,
      }),
    });
    return response.json();
  } catch (error) {
    console.error('Failed to link wallet:', error);
    throw error;
  }
}
