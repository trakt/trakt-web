import { AuthMappedMock } from '$mocks/data/auth/AuthMappedMock.ts';
import { EncryptedAuthMock } from '$mocks/data/auth/EncryptedAuthMock.ts';
import { encryptionKeyMock } from '$mocks/data/auth/encryptionKeyMock.ts';
import { describe, expect, it } from 'vitest';
import { decrypt } from './decrypt.ts';

describe('utils: decrypt', () => {
  it('should decrypt', async () => {
    const encryptionKey = await encryptionKeyMock();
    const data = await decrypt(encryptionKey, EncryptedAuthMock);

    expect(data).toEqual(AuthMappedMock);
  });

  it('should return null if data is null', async () => {
    const encryptionKey = await encryptionKeyMock();
    const data = await decrypt(encryptionKey, null);

    expect(data).toBeNull();
  });

  it('should return null if data is invalid', async () => {
    const encryptionKey = await encryptionKeyMock();
    const data = await decrypt(encryptionKey, 'invalid data');

    expect(data).toBeNull();
  });

  it('should return null if crypto.subtle.decrypt fails', async () => {
    const encryptionKey = await encryptionKeyMock(1337);

    const data = await decrypt(encryptionKey, EncryptedAuthMock);

    expect(data).toBeNull();
  });
});
