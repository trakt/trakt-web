export async function decrypt<T>(
  key: CryptoKey,
  data: string,
): Promise<T | Nil> {
  try {
    const encryptedBuffer = new Uint8Array(
      atob(data)
        .split('')
        .map((c) => c.charCodeAt(0)),
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(12),
      },
      key,
      encryptedBuffer.buffer,
    );

    const jsonString = new TextDecoder().decode(decryptedBuffer);

    return JSON.parse(jsonString);
  } catch (_) {
    console.error('Failed to decrypt data', _);
    return null;
  }
}
