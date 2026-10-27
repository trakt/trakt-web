import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import DialogActions from './DialogActions.svelte';

function renderActions(isAutofocused?: boolean) {
  render(DialogActions, {
    props: {
      secondary: { label: 'Cancel', onclick: vi.fn() },
      primary: {
        label: 'Delete',
        onclick: vi.fn(),
        color: 'red',
        isAutofocused,
      },
    },
  });
}

describe('DialogActions', () => {
  it('should render the secondary action before the primary one', () => {
    renderActions();

    const labels = screen
      .getAllByRole('button')
      .map((button) => button.textContent?.trim());

    expect(labels).toEqual(['Cancel', 'Delete']);
  });

  it('should not mark the primary action for autofocus by default', () => {
    renderActions();

    expect(screen.getByRole('button', { name: 'Delete' })).not.toHaveAttribute(
      'data-autofocus',
    );
  });

  it('should mark the primary action for autofocus when asked', () => {
    renderActions(true);

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute(
      'data-autofocus',
    );
  });
});
