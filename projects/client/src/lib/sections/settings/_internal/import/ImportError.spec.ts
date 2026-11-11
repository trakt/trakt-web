import { IMPORT_SOURCE_CONFIGS } from '$lib/sections/settings/import/ImportTypes.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import ImportError from './ImportError.svelte';

describe('ImportError', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should offer a report form when the import fails', async () => {
    const user = userEvent.setup();

    renderComponent(ImportError, {
      props: {
        config: IMPORT_SOURCE_CONFIGS.tvtime,
        error: 'unreadable zip',
        onreset: () => {},
      },
    });

    await user.click(
      await screen.findByRole('button', {
        name: 'Report a problem with this import to the Trakt team',
      }),
    );

    expect(
      await screen.findByText(
        'Drop your TV Time export here, or click to choose files',
      ),
    ).toBeVisible();
  });

  it('should close the report form on cancel', async () => {
    const user = userEvent.setup();
    const reportButton = {
      name: 'Report a problem with this import to the Trakt team',
    };

    renderComponent(ImportError, {
      props: {
        config: IMPORT_SOURCE_CONFIGS.tvtime,
        error: 'unreadable zip',
        onreset: () => {},
      },
    });

    await user.click(await screen.findByRole('button', reportButton));
    const form = (
      await screen.findByText(
        'Drop your TV Time export here, or click to choose files',
      )
    ).closest('.trakt-import-report-form');
    await user.click(
      within(form as HTMLElement).getByRole('button', { name: 'Cancel' }),
    );

    await waitFor(() =>
      expect(screen.getByRole('button', reportButton)).toBeVisible(),
    );
  });
});
