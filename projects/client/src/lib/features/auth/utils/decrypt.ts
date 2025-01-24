import { error } from '$lib/utils/console/print.ts';

export async function decrypt<T>(
  key: CryptoKey,
  data: string | Nil,
): Promise<T | Nil> {
  if (!data) {
    return null;
  }

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
      encryptedBuffer,
    );

    const jsonString = new TextDecoder().decode(decryptedBuffer);

    return JSON.parse(jsonString);
  } catch (_) {
    error('Failed to decrypt data', _);
    return null;
  }
}
