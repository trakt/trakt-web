import { IMPORT_SOURCE_CONFIGS } from '$lib/sections/settings/import/ImportTypes.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import ImportComplete from './ImportComplete.svelte';

const skippedItem = {
  action: 'history',
  type: 'movie',
  ids: {},
  title: 'Missing Movie',
  year: 1999,
} as const;

describe('ImportComplete', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should open the report form with the skipped items attached', async () => {
    const user = userEvent.setup();

    renderComponent(ImportComplete, {
      props: {
        config: IMPORT_SOURCE_CONFIGS.letterboxd,
        processedCount: 2,
        errorCount: 0,
        unresolved: [skippedItem],
        ambiguous: [],
        onimportpicked: () => Promise.resolve(),
        onreset: () => {},
      },
    });

    await user.click(
      await screen.findByRole('button', {
        name: 'Report a problem with this import to the Trakt team',
      }),
    );

    expect(await screen.findByText('trakt-import-skipped.csv')).toBeVisible();
    expect(
      screen.getByText(
        'Drop your Letterboxd export here, or click to choose files',
      ),
    ).toBeVisible();

    const send = screen.getByRole('button', {
      name: 'Send the report to the Trakt team',
    });
    expect(send).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText('Tell us what happened…'),
      'My films are missing',
    );

    expect(send).toBeEnabled();
  });
});
