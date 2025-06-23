import { vi } from 'vitest';

const mockUserManager = vi.fn(() => ({
  getUser: vi.fn().mockResolvedValue(null),
  signinSilent: vi.fn().mockResolvedValue(null),
  removeUser: vi.fn().mockResolvedValue(undefined),
  revokeTokens: vi.fn().mockResolvedValue(undefined),
  signinRedirect: vi.fn().mockResolvedValue(undefined),
  signinRedirectCallback: vi.fn().mockResolvedValue(undefined),
  events: {
    addUserLoaded: vi.fn().mockResolvedValue(null),
    addUserUnloaded: vi.fn(),
  },
}));

vi.mock('oidc-client-ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('oidc-client-ts')>();
  return {
    ...actual,
    UserManager: mockUserManager,
  };
});
