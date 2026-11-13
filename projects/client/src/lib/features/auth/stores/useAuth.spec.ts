import { LoginErrorType } from '$lib/features/auth/models/LoginErrorType.ts';
import { loginErrorStore } from '$lib/features/auth/_internal/loginErrorStore.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import type { UserManager } from 'oidc-client-ts';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setUserManager } from './userManager.ts';
import { useAuth } from './useAuth.ts';

type ManagerMocks = Record<
  'signinRedirect' | 'signoutRedirect' | 'revokeTokens',
  ReturnType<typeof vi.fn>
>;

function createManager(overrides: Partial<ManagerMocks>) {
  const manager: ManagerMocks = {
    signinRedirect: vi.fn().mockResolvedValue(undefined),
    signoutRedirect: vi.fn().mockResolvedValue(undefined),
    revokeTokens: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  setUserManager(manager as unknown as UserManager);

  return manager;
}

describe('store: useAuth', () => {
  beforeEach(() => {
    setAuthorization(true);
    loginErrorStore.clear();
  });

  afterEach(() => {
    setUserManager(null);
  });

  describe('login', () => {
    it('should report an unreachable provider without a user manager', async () => {
      const { login } = await renderStore(() => useAuth());
      setUserManager(null);

      await login('navbar');

      expect(await firstValueFrom(loginErrorStore.error$)).to.equal(
        LoginErrorType.Unreachable,
      );
    });

    it('should redirect to sign in without the email form', async () => {
      const { login } = await renderStore(() => useAuth());
      const manager = createManager({});

      await login('navbar');

      expect(manager.signinRedirect).toHaveBeenCalledOnce();
      expect(manager.signinRedirect.mock.calls.at(0)?.at(0)).to.deep.include({
        extraQueryParams: { hide_email_form: 'true', lang: 'en' },
      });
    });

    it('should carry a returnable path through the sign in state', async () => {
      globalThis.window.history.replaceState(
        {},
        '',
        `/?${new URLSearchParams({ return_to: '/vip?source=yir-email' })}`,
      );
      const { login } = await renderStore(() => useAuth());
      const manager = createManager({});

      await login('landing-login');
      globalThis.window.history.replaceState({}, '', '/');

      expect(manager.signinRedirect.mock.calls.at(0)?.at(0)).to.deep.include({
        state: '/vip?source=yir-email',
      });
    });

    it('should drop a return path that is not returnable', async () => {
      globalThis.window.history.replaceState(
        {},
        '',
        `/?${new URLSearchParams({ return_to: 'https://evil.example/vip' })}`,
      );
      const { login } = await renderStore(() => useAuth());
      const manager = createManager({});

      await login('landing-login');
      globalThis.window.history.replaceState({}, '', '/');

      expect(manager.signinRedirect.mock.calls.at(0)?.at(0)?.state).to.equal(
        undefined,
      );
    });

    it('should clear a previous login error when starting again', async () => {
      loginErrorStore.set(LoginErrorType.RateLimited);
      const { login } = await renderStore(() => useAuth());
      createManager({});

      await login('navbar');

      expect(await firstValueFrom(loginErrorStore.error$)).to.equal(null);
    });

    it('should report an unreachable provider when the redirect fails', async () => {
      const { login } = await renderStore(() => useAuth());
      createManager({
        signinRedirect: vi.fn().mockRejectedValue(new Error('network')),
      });

      await login('navbar');

      expect(await firstValueFrom(loginErrorStore.error$)).to.equal(
        LoginErrorType.Unreachable,
      );
    });
  });

  describe('logout', () => {
    it('should revoke tokens and end the provider session', async () => {
      const { logout } = await renderStore(() => useAuth());
      const manager = createManager({});

      await logout();

      expect(manager.revokeTokens).toHaveBeenCalledOnce();
      expect(manager.signoutRedirect).toHaveBeenCalledOnce();
    });

    it('should mark the user as unauthorized', async () => {
      const { logout, isAuthorized } = await renderStore(() => useAuth());
      createManager({});

      await logout();

      expect(await firstValueFrom(isAuthorized)).to.equal(false);
    });

    it('should still end the session when revoking tokens keeps failing', async () => {
      const { logout } = await renderStore(() => useAuth());
      const manager = createManager({
        revokeTokens: vi.fn().mockRejectedValue(new Error('revoke failed')),
      });

      await logout();

      expect(manager.signoutRedirect).toHaveBeenCalledOnce();
    }, 30_000);

    it('should log out without a user manager', async () => {
      const { logout, isAuthorized } = await renderStore(() => useAuth());
      setUserManager(null);

      await logout();

      expect(await firstValueFrom(isAuthorized)).to.equal(false);
    });
  });
});
