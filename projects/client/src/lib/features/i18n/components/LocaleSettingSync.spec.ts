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
  page,
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
    userStore: makeStore<{ locale: string | null | undefined }>({
      locale: undefined,
    }),
    localeStore: makeStore('en-us'),
    authStore: makeStore(false),
    applyLocalePreference: vi.fn(),
    setLocaleSetting: vi.fn(),
    page: { data: { localeSource: 'header' } as { localeSource: string } },
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
vi.mock('$app/state', () => ({ page }));
vi.mock('./useLocale', () => ({ useLocale: () => localeStore }));

// Imported after the mocks so its `useUser` / `useLocale` bind to the stubs.
const { default: LocaleSettingSync } = await import(
  './LocaleSettingSync.svelte'
);

describe('LocaleSettingSync', () => {
  beforeEach(() => {
    applyLocalePreference.mockClear();
    setLocaleSetting.mockClear();
    userStore.set({ locale: undefined });
    localeStore.set('en-us');
    authStore.set(false);
    page.data = { localeSource: 'header' };
  });

  it('should apply the saved locale when it differs from the active one', async () => {
    userStore.set({ locale: 'fr-FR' });

    renderComponent(LocaleSettingSync, { props: {} });

    await waitFor(() =>
      expect(applyLocalePreference).toHaveBeenCalledWith({
        value: 'fr-FR',
        setLocale: localeStore.set,
      })
    );
  });

  it('should do nothing when no locale is saved', async () => {
    userStore.set({ locale: undefined });

    renderComponent(LocaleSettingSync, { props: {} });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(applyLocalePreference).not.toHaveBeenCalled();
  });

  it('should do nothing when the saved locale already matches the active one', async () => {
    localeStore.set('fr-FR');
    userStore.set({ locale: 'fr-FR' });

    renderComponent(LocaleSettingSync, { props: {} });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(applyLocalePreference).not.toHaveBeenCalled();
  });

  describe('backfill', () => {
    it('should persist the active locale when it came from the cookie and nothing is saved', async () => {
      authStore.set(true);
      localeStore.set('fr-FR');
      page.data = { localeSource: 'cookie' };

      renderComponent(LocaleSettingSync, { props: {} });

      await waitFor(() =>
        expect(setLocaleSetting).toHaveBeenCalledWith('fr-FR')
      );
    });

    it('should not backfill for anonymous users', async () => {
      authStore.set(false);
      page.data = { localeSource: 'cookie' };

      renderComponent(LocaleSettingSync, { props: {} });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(setLocaleSetting).not.toHaveBeenCalled();
    });

    it('should not backfill when the active locale is an Accept-Language fallback', async () => {
      authStore.set(true);
      page.data = { localeSource: 'header' };

      renderComponent(LocaleSettingSync, { props: {} });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(setLocaleSetting).not.toHaveBeenCalled();
    });

    it('should not backfill when a locale is already saved', async () => {
      authStore.set(true);
      userStore.set({ locale: 'fr-FR' });
      page.data = { localeSource: 'cookie' };

      renderComponent(LocaleSettingSync, { props: {} });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(setLocaleSetting).not.toHaveBeenCalled();
    });

    it('should backfill only once when the user re-emits before the write lands', async () => {
      authStore.set(true);
      localeStore.set('fr-FR');
      page.data = { localeSource: 'cookie' };

      renderComponent(LocaleSettingSync, { props: {} });

      await waitFor(() => expect(setLocaleSetting).toHaveBeenCalledTimes(1));

      // Persisting invalidates the user query; the refetch re-emits with the
      // saved locale still empty before the final value arrives.
      userStore.set({ locale: undefined });
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(setLocaleSetting).toHaveBeenCalledTimes(1);
    });
  });
});
