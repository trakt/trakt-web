import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { describe, expect, it } from 'vitest';
import { getUserManager } from '../stores/userManager.ts';

describe('component: AuthProvider', () => {
  it('should not render children before the user manager is set', async () => {
    setAuthorization(false);

    // `/callback` reaches for `getUserManager()` in its own `onMount`, which
    // Svelte fires before the provider's. Rendering children in the provider's
    // first cycle therefore hands them a null manager and the sign-in callback
    // silently never runs.
    const manager = await renderStore(() => getUserManager());

    expect(manager).not.toBeNull();
  });
});
