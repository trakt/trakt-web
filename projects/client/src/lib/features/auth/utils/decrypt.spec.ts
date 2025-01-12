import { AuthMock } from '$mocks/data/auth/AuthMock';
import { EncryptedAuthMock } from '$mocks/data/auth/EncryptedAuthMock';
import { encryptionKeyMock } from '$mocks/data/auth/encryptionKeyMock';
import { describe, expect, it, vi } from 'vitest';
import { decrypt } from './decrypt';

describe('utils: decrypt', () => {
  it('should decrypt', async () => {
    const encryptionKey = await encryptionKeyMock();
    const data = await decrypt(encryptionKey, EncryptedAuthMock);

    expect(data).toEqual(AuthMock);
  });

  it('should return null if data is null', async () => {
    const encryptionKey = await encryptionKeyMock();
    const data = await decrypt(encryptionKey, null);

    expect(data).toBeNull();
  });

  it('should return null if data is invalid', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const encryptionKey = await encryptionKeyMock();
    const data = await decrypt(encryptionKey, 'invalid data');

    expect(data).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should return null if crypto.subtle.decrypt fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const encryptionKey = await encryptionKeyMock(1337);

    const data = await decrypt(encryptionKey, EncryptedAuthMock);

    expect(data).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
