import { render, waitFor } from '@testing-library/svelte';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ActionToastHost from './ActionToastHost.svelte';
import { actionToastStore } from './_internal/actionToastStore.ts';

vi.mock('$lib/features/feature-flag/useFeatureFlag.ts', () => ({
  useFeatureFlag: () => ({ isEnabled: () => of(true) }),
}));

describe('component: ActionToastHost', () => {
  beforeEach(() => {
    actionToastStore.dismiss();
  });

  it('should surface an error toast when the action handler rejects', async () => {
    const { container, getByLabelText } = render(ActionToastHost);

    actionToastStore.notify({
      message: 'Removed from your history',
      action: {
        text: 'Undo',
        label: 'Undo removing from history',
        onAction: () => Promise.reject(new Error('nope')),
      },
    });

    await waitFor(() => expect(getByLabelText('Undo removing from history')));
    getByLabelText('Undo removing from history').click();

    await waitFor(() =>
      expect(container.querySelector('[data-variant="error"]')).not.toBeNull()
    );
  });
});
