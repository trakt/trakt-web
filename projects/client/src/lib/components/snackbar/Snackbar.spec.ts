import SnackbarMountHarness from '$test/beds/snackbar/SnackbarMountHarness.svelte';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { describe, expect, it, vi } from 'vitest';

describe('component: Snackbar', () => {
  it('should play a fly transition when a parent block mounts it (not just an open toggle)', async () => {
    // Svelte drives `css` transitions through the Web Animations API, so a
    // fired intro shows up as an `element.animate()` call.
    const animate = vi.spyOn(Element.prototype, 'animate');

    const { rerender, container } = render(SnackbarMountHarness, {
      props: { show: false },
    });

    expect(container.querySelector('.trakt-snackbar')).toBeNull();
    animate.mockClear();

    // Toggling the parent `{#if}` is how ActionToastHost mounts the toast.
    // A *local* transition would be skipped (the Snackbar's own `{#if open}`
    // never toggled); `|global` is what makes the intro run here.
    await rerender({ show: true });
    await tick();

    expect(container.querySelector('.trakt-snackbar')).not.toBeNull();
    expect(animate).toHaveBeenCalled();

    animate.mockRestore();
  });
});
