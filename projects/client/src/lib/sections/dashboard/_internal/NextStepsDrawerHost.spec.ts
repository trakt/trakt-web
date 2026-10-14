import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { serveUnusedAccount } from '$test/beds/next-steps/serveUnusedAccount.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NextStepsDrawerHost from './NextStepsDrawerHost.svelte';

describe('NextStepsDrawerHost', () => {
  beforeEach(() => {
    setAuthorization(true);
    serveUnusedAccount();
  });

  it('should swap a skipped step for the next one', async () => {
    renderComponent(NextStepsDrawerHost, { props: { onClose: () => {} } });

    const skip = await screen.findByRole('button', {
      name: "Skip: Add what you've watched",
    });
    await userEvent.click(skip);

    await waitFor(() =>
      expect(screen.queryByText("Add what you've watched")).toBeNull()
    );
    expect(screen.getByText('Set your favorite genres')).toBeInTheDocument();
  });

  it('should close once nothing is left to show', async () => {
    const onClose = vi.fn();
    renderComponent(NextStepsDrawerHost, { props: { onClose } });

    const skipNextStep = async (): Promise<void> => {
      const [skip] = await screen.findAllByRole('button', { name: /^Skip: / });
      await userEvent.click(assertDefined(skip));
      if (onClose.mock.calls.length > 0) return;
      return skipNextStep();
    };
    await skipNextStep();

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });
});
