import { OidcUserMock } from '$mocks/data/auth/OidcUserMock.ts';
import { vi } from 'vitest';
import { isAuthorized } from '../beds/_internal/isAuthorized.ts';

function getMockUser() {
  return isAuthorized.value ? OidcUserMock : null;
}

const mockUserManager = vi.fn(() => ({
  getUser: vi.fn().mockResolvedValue(getMockUser()),
  signinSilent: vi.fn().mockResolvedValue(null),
  removeUser: vi.fn().mockResolvedValue(undefined),
  revokeTokens: vi.fn().mockResolvedValue(undefined),
  signinRedirect: vi.fn().mockResolvedValue(undefined),
  signinRedirectCallback: vi.fn().mockResolvedValue(undefined),
  events: {
    addUserLoaded: vi.fn().mockResolvedValue(OidcUserMock),
    addUserUnloaded: vi.fn(),
    addSilentRenewError: vi.fn(),
  },
}));

vi.mock('oidc-client-ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('oidc-client-ts')>();
  return {
    ...actual,
    UserManager: mockUserManager,
  };
});
