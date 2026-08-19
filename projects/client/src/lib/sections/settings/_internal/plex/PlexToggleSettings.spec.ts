import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import PlexToggleSettings from './PlexToggleSettings.svelte';

const icon = createRawSnippet(() => ({ render: () => '<span></span>' }));

const DUPLICATE_TITLE = 'Shows';
const DUPLICATE_LABEL = 'Ratings';

function renderWithDuplicateText() {
  const onToggle = vi.fn();

  render(PlexToggleSettings, {
    props: {
      title: 'Sync',
      description: 'Sync settings',
      isLoading: false,
      onToggle,
      rows: [
        {
          mediaKind: 'show' as const,
          icon,
          title: DUPLICATE_TITLE,
          chips: [
            {
              settingKey: 'rated',
              label: DUPLICATE_LABEL,
              ariaLabel: 'Toggle show ratings',
              isActive: true,
            },
          ],
        },
        {
          mediaKind: 'episode' as const,
          icon,
          title: DUPLICATE_TITLE,
          chips: [
            {
              settingKey: 'rated',
              label: DUPLICATE_LABEL,
              ariaLabel: 'Toggle episode ratings',
              isActive: false,
            },
          ],
        },
      ],
    },
  });

  return onToggle;
}

describe('PlexToggleSettings', () => {
  it('should render every row when two rows share the same title', () => {
    renderWithDuplicateText();

    expect(screen.getAllByText(DUPLICATE_TITLE)).toHaveLength(2);
  });

  it('should render every chip when two chips share the same label', () => {
    renderWithDuplicateText();

    expect(screen.getAllByText(DUPLICATE_LABEL)).toHaveLength(2);
  });

  it('should report the media kind and setting key of the toggled chip', async () => {
    const user = userEvent.setup();
    const onToggle = renderWithDuplicateText();

    await user.click(
      screen.getByRole('button', { name: 'Toggle episode ratings' }),
    );

    expect(onToggle).toHaveBeenCalledWith({
      mediaKind: 'episode',
      settingKey: 'rated',
      current: false,
    });
  });
});
