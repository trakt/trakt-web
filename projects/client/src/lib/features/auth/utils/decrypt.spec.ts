import { AuthMock } from '$mocks/data/auth/AuthMock';
import { EncryptedAuthMock } from '$mocks/data/auth/EncryptedAuthMock';
import { mockSessionKey } from '$mocks/data/auth/mockSessionKey';
import { describe, expect, it } from 'vitest';
import { decrypt } from './decrypt';

describe('utils: decrypt', () => {
  it('should decrypt', async () => {
    const testCryptoKey = await mockSessionKey();
    const data = await decrypt(testCryptoKey, EncryptedAuthMock);

    expect(data).toEqual(AuthMock);
  });
});
