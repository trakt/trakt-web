export function mockSessionKey() {
  return crypto.subtle.importKey(
    'raw',
    new Uint8Array(32).fill(1),
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt'],
  );
}
