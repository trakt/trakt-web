import CardActionBar from './CardActionBar.svelte';

import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('CardActionBar', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  afterEach(() => {
    setAuthorization(false);
  });

  it('should treat the background as plain by default', async () => {
    const { container } = renderComponent(CardActionBar, {
      props: {
        actions: createRawSnippet(() => ({
          render: () => '<button>Menu</button>',
        })),
      },
    });

    await waitFor(() => {
      expect(container.querySelector('.trakt-card-action-bar'))
        .toHaveAttribute('data-surface', 'plain');
    });
  });

  it('should identify image-backed action bars', async () => {
    const { container } = renderComponent(CardActionBar, {
      props: {
        surface: 'image',
        actions: createRawSnippet(() => ({
          render: () => '<button>Menu</button>',
        })),
      },
    });

    await waitFor(() => {
      expect(container.querySelector('.trakt-card-action-bar'))
        .toHaveAttribute('data-surface', 'image');
    });
  });
});
