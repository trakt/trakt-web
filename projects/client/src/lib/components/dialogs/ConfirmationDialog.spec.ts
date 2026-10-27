import type { ConfirmationOperation } from '$lib/features/confirmation/models/ConfirmationOperation.ts';
import { render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ConfirmationDialog from './ConfirmationDialog.svelte';

function renderDialog(operation: ConfirmationOperation) {
  render(ConfirmationDialog, {
    props: {
      title: 'Cancel VIP?',
      message: 'You keep VIP until it renews.',
      buttonText: 'Cancel VIP',
      cancelText: 'Keep VIP',
      operation,
      onAction: vi.fn(),
    },
  });
}

describe('ConfirmationDialog', () => {
  beforeEach(() => {
    document.body.style.pointerEvents = '';
  });

  it('should focus the safe action of a preventative confirmation on open', async () => {
    renderDialog('preventative');

    const keep = await screen.findByRole('button', { name: 'Keep VIP' });
    await waitFor(() => expect(document.activeElement).toBe(keep));
  });
});
