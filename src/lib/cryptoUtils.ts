/**
 * Generate a random string with specified length
 */
export const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map(x => possible[x % possible.length])
    .join('');
};

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