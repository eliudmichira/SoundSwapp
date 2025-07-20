/**
 * Cryptographic utility functions for OAuth and PKCE
 */

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map(x => possible[x % possible.length])
    .join('');
}

/**
 * Generate a code verifier for PKCE
 * Returns a random string between 43 and 128 characters long
 */
export function generateCodeVerifier(): string {
  return generateRandomString(96); // Using 96 for good security while staying well within limits
}

/**
 * Generate a code challenge from a code verifier using SHA-256
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  return base64UrlEncode(hash);
}

/**
 * Encode an ArrayBuffer as a base64url string
 */
export function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const base64 = btoa(String.fromCharCode(...bytes));
  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generate a secure state parameter for OAuth
 */
export function generateOAuthState(): string {
  return generateRandomString(32);
}

/**
 * Hash a string using SHA-256
 */
export async function sha256Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  return base64UrlEncode(hash);
}

/**
 * Validate the format of a code verifier
 */
export function isValidCodeVerifier(verifier: string): boolean {
  return /^[A-Za-z0-9_-]{43,128}$/.test(verifier);
}

/**
 * Calculates SHA-256 hash of string
 */
export const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

/**
 * Base64 URL encoding of ArrayBuffer
 * This is a URL-safe version of base64 encoding
 */
export const base64urlencode = (arrayBuffer: ArrayBuffer): string => {
  // Convert the ArrayBuffer to a string using Uint8 Array
  const bytes = new Uint8Array(arrayBuffer);
  let base64 = btoa(String.fromCharCode(...bytes));
  
  // Make the string URL-safe:
  // 1. Replace "+" with "-"
  // 2. Replace "/" with "_"
  // 3. Remove trailing "="
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}; 