import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { createRawSnippet } from 'svelte';
import { fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import RecapSpoilerGuard from './RecapSpoilerGuard.svelte';

const children = createRawSnippet(() => ({
  render: () => '<p>Hidden text</p>',
}));

describe('RecapSpoilerGuard', () => {
  it('should show the message and hold the content back while guarded', async () => {
    renderComponent(RecapSpoilerGuard, {
      props: {
        isGuarded: true,
        message: 'This spoils it.',
        onReveal: vi.fn(),
        children,
      },
    });

    expect(await screen.findByText('This spoils it.')).toBeTruthy();
  });

  it('should reveal on request', async () => {
    const onReveal = vi.fn();
    renderComponent(RecapSpoilerGuard, {
      props: {
        isGuarded: true,
        message: 'This spoils it.',
        onReveal,
        children,
      },
    });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Show it anyway' }),
    );

    expect(onReveal).toHaveBeenCalledOnce();
  });

  it('should show only the content once unguarded', async () => {
    renderComponent(RecapSpoilerGuard, {
      props: {
        isGuarded: false,
        message: 'This spoils it.',
        onReveal: vi.fn(),
        children,
      },
    });

    expect(await screen.findByText('Hidden text')).toBeTruthy();
    expect(screen.queryByText('This spoils it.')).toBeNull();
  });
});
