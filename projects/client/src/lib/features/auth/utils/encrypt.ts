export async function encrypt<T extends Object>(
  key: CryptoKey,
  data: T,
): Promise<string> {
  const jsonString = JSON.stringify(data);
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(12),
    },
    key,
    new TextEncoder().encode(jsonString),
  );

  return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}
