import { AuthMappedMock } from '$mocks/data/auth/AuthMappedMock.ts';
import { EncryptedAuthMock } from '$mocks/data/auth/EncryptedAuthMock.ts';
import { encryptionKeyMock } from '$mocks/data/auth/encryptionKeyMock.ts';
import { describe, expect, it } from 'vitest';
import { encrypt } from './encrypt.ts';

describe('utils: encrypt', () => {
  it('should encrypt', async () => {
    const testCryptoKey = await encryptionKeyMock();
    const encryptedData = await encrypt(testCryptoKey, AuthMappedMock);

    expect(encryptedData).toEqual(EncryptedAuthMock);
  });

  it('should result in different results for different keys', async () => {
    const keys = await Promise.all(
      Array.from({ length: 5 }, () =>
        crypto.subtle.generateKey(
          {
            name: 'AES-GCM',
            length: 256,
          },
          true,
          ['encrypt'],
        )),
    );

    const results = await Promise.all(
      keys.map((key) => encrypt(key, EncryptedAuthMock)),
    );
    expect(new Set(results).size).toBe(results.length);
  });
});
