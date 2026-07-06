import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Minimal Svelte-store contract so `$user` / `$locale` / `$isAuthorized`
// auto-subscribe and `locale.set` stays observable, without pulling in the
// real hooks.
const {
  userStore,
  localeStore,
  authStore,
  applyLocalePreference,
  setLocaleSetting,
} = vi.hoisted(() => {
  const makeStore = <T>(initial: T) => {
    let current = initial;
    const subscribers = new Set<(value: T) => void>();
    return {
      subscribe(run: (value: T) => void) {
        run(current);
        subscribers.add(run);
        return () => subscribers.delete(run);
      },
      set(value: T) {
        current = value;
        subscribers.forEach((run) => run(current));
      },
    };
  };

  return {
    userStore: makeStore<{ id: number; locale: string | null | undefined }>({
      id: 0,
      locale: undefined,
    }),
    localeStore: makeStore('en-us'),
    authStore: makeStore(false),
    applyLocalePreference: vi.fn(),
    setLocaleSetting: vi.fn(),
  };
});

vi.mock('../applyLocalePreference', () => ({ applyLocalePreference }));
vi.mock('$lib/features/auth/stores/useUser', () => ({
  useUser: () => ({ user: userStore }),
}));
vi.mock('$lib/features/auth/stores/useAuth', () => ({
  useAuth: () => ({ isAuthorized: authStore }),
}));
vi.mock('$lib/sections/settings/_internal/useSettings', () => ({
  useSettings: () => ({ locale: { set: setLocaleSetting } }),
}));
vi.mock('./useLocale', () => ({ useLocale: () => localeStore }));

// Imported after the mocks so its `useUser` / `useLocale` bind to the stubs.
const { default: LocaleSettingSync } = await import(
  './LocaleSettingSync.svelte'
);

describe('LocaleSettingSync', () => {
  beforeEach(() => {
    applyLocalePreference.mockClear();
    setLocaleSetting.mockClear();
    userStore.set({ id: 0, locale: undefined });
    localeStore.set('en-us');
    authStore.set(false);
  });

  it('should apply the saved locale when it differs from the active one', async () => {
    userStore.set({ id: 7, locale: 'fr-FR' });

    renderComponent(LocaleSettingSync, { props: {} });

    await waitFor(() =>
      expect(applyLocalePreference).toHaveBeenCalledWith({
        value: 'fr-FR',
        setLocale: localeStore.set,
      })
    );
  });

  it('should do nothing when no locale is saved', async () => {
    userStore.set({ id: 7, locale: undefined });

    renderComponent(LocaleSettingSync, { props: {} });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(applyLocalePreference).not.toHaveBeenCalled();
  });

  it('should do nothing when the saved locale already matches the active one', async () => {
    localeStore.set('fr-FR');
    userStore.set({ id: 7, locale: 'fr-FR' });

    renderComponent(LocaleSettingSync, { props: {} });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(applyLocalePreference).not.toHaveBeenCalled();
  });

  describe('backfill', () => {
    it('should persist the active locale for an authorized user with nothing saved', async () => {
      authStore.set(true);
      localeStore.set('fr-FR');

      renderComponent(LocaleSettingSync, { props: {} });

      await waitFor(() =>
        expect(setLocaleSetting).toHaveBeenCalledWith('fr-FR')
      );
    });

    it('should not backfill for anonymous users', async () => {
      authStore.set(false);

      renderComponent(LocaleSettingSync, { props: {} });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(setLocaleSetting).not.toHaveBeenCalled();
    });

    it('should not backfill when a locale is already saved', async () => {
      authStore.set(true);
      localeStore.set('fr-FR');
      userStore.set({ id: 7, locale: 'fr-FR' });

      renderComponent(LocaleSettingSync, { props: {} });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(setLocaleSetting).not.toHaveBeenCalled();
    });

    it('should backfill only once when the user re-emits before the write lands', async () => {
      authStore.set(true);
      localeStore.set('fr-FR');
      userStore.set({ id: 7, locale: undefined });

      renderComponent(LocaleSettingSync, { props: {} });

      await waitFor(() => expect(setLocaleSetting).toHaveBeenCalledTimes(1));

      // Persisting invalidates the user query; the refetch re-emits (same id)
      // with the saved locale still empty before the final value arrives.
      userStore.set({ id: 7, locale: undefined });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(setLocaleSetting).toHaveBeenCalledTimes(1);
    });

    it('should reconcile again when a different user logs in', async () => {
      // The component lives in the root layout and survives login/logout, so
      // the latch must reset per user rather than latch for the app lifetime.
      authStore.set(true);
      localeStore.set('fr-FR');
      userStore.set({ id: 7, locale: undefined });

      renderComponent(LocaleSettingSync, { props: {} });

      await waitFor(() => expect(setLocaleSetting).toHaveBeenCalledTimes(1));

      userStore.set({ id: 42, locale: undefined });

      await waitFor(() => expect(setLocaleSetting).toHaveBeenCalledTimes(2));
    });
  });
});
