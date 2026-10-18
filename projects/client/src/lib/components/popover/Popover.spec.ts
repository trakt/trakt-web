import Popover from './Popover.svelte';

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';

const children = createRawSnippet(() => ({
  render: () => '<span>Trigger</span>',
}));

const content = createRawSnippet(() => ({
  render: () => '<p>Popover body</p>',
}));

describe('component: Popover', () => {
  it('should not mount its content before the first open', async () => {
    render(Popover, { props: { children, content, label: 'More' } });

    expect(
      await screen.findByRole('button', { name: 'More' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('should mount its content when opened by the trigger', async () => {
    render(Popover, { props: { children, content, label: 'More' } });

    await fireEvent.click(await screen.findByRole('button', { name: 'More' }));

    await waitFor(() => {
      expect(screen.getByText('Popover body')).toBeInTheDocument();
    });
  });

  it('should mount its content when opened through the open prop', async () => {
    const { rerender } = render(Popover, {
      props: { children, content, label: 'More', open: false },
    });

    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();

    await rerender({ open: true });

    await waitFor(() => {
      expect(screen.getByText('Popover body')).toBeInTheDocument();
    });
  });
});
