import crypto from 'crypto';

const RAW_KEY = process.env.CREDENTIALS_KEY || 'default-fallback-secret-key-32-chars!';

// Derives a 32-byte (256-bit) buffer key from the secret string
function getKeyBuffer(): Buffer {
  return crypto.createHash('sha256').update(RAW_KEY).digest();
}

/**
 * Encrypt credentials using AES-256-GCM.
 * Output format: `ivHex:authTagHex:encryptedHex`
 */
export function encryptCredentials(text: string): string {
  if (!text) return '';
  const key = getKeyBuffer();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt credentials encrypted with encryptCredentials (AES-256-GCM).
 */
export function decryptCredentials(cipherText: string): string {
  if (!cipherText) return '';

  // If text is not formatted as iv:authTag:encrypted, return as-is or attempt recovery
  const parts = cipherText.split(':');
  if (parts.length !== 3) {
    return cipherText;
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  try {
    const key = getKeyBuffer();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('[Encryption] Decryption failed:', error);
    return cipherText;
  }
}
