export function encryptionKeyMock(value = 1): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new Uint8Array(32).fill(value),
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt'],
  );
}
