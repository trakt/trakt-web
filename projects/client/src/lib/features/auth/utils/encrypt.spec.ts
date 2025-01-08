import { AuthMock } from '$mocks/data/auth/AuthMock';
import { EncryptedAuthMock } from '$mocks/data/auth/EncryptedAuthMock';
import { mockSessionKey } from '$mocks/data/auth/mockSessionKey';
import { describe, expect, it } from 'vitest';
import { encrypt } from './encrypt';

describe('utils: encrypt', () => {
  it('should encrypt', async () => {
    const testCryptoKey = await mockSessionKey();
    const encryptedData = await encrypt(testCryptoKey, AuthMock);

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
