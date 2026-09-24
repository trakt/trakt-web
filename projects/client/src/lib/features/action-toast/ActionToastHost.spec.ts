import { render, waitFor } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import ActionToastHost from './ActionToastHost.svelte';
import { actionToastStore } from './_internal/actionToastStore.ts';

describe('component: ActionToastHost', () => {
  beforeEach(() => {
    actionToastStore.dismiss();
  });

  it('should surface an error toast when the action handler rejects', async () => {
    const { container, getByLabelText } = render(ActionToastHost);

    actionToastStore.notify({
      message: 'Added to your favorites',
      action: {
        text: 'Undo',
        label: 'Undo adding to favorites',
        onAction: () => Promise.reject(new Error('nope')),
      },
    });

    await waitFor(() => expect(getByLabelText('Undo adding to favorites')));
    getByLabelText('Undo adding to favorites').click();

    await waitFor(() =>
      expect(container.querySelector('[data-variant="error"]')).not.toBeNull()
    );
  });
});
