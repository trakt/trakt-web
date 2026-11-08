import { SeasonRecapPublicMappedMock } from '$mocks/data/summary/season-recap/mapped/SeasonRecapPublicMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import RecapTab from './RecapTab.svelte';

describe('RecapTab', () => {
  it('should credit the Wikipedia article the recap was adapted from', async () => {
    renderComponent(RecapTab, {
      props: { recap: SeasonRecapPublicMappedMock },
    });

    const credit = await screen.findByRole('link', {
      name: 'Adapted from Wikipedia',
    });

    expect(credit.getAttribute('href')).toBe(
      SeasonRecapPublicMappedMock.attribution,
    );
  });

  it('should link the CC BY-SA 4.0 licence', async () => {
    renderComponent(RecapTab, {
      props: { recap: SeasonRecapPublicMappedMock },
    });

    const license = await screen.findByRole('link', { name: 'CC BY-SA 4.0' });

    expect(license.getAttribute('href')).toBe(
      'https://creativecommons.org/licenses/by-sa/4.0/',
    );
  });

  it('should show no credit when the recap has no source', async () => {
    const { container } = renderComponent(RecapTab, {
      props: { recap: { ...SeasonRecapPublicMappedMock, attribution: null } },
    });

    await waitFor(() =>
      expect(container.querySelector('.trakt-recap-tab')).not.toBeNull(),
    );

    expect(screen.queryByRole('link', { name: 'CC BY-SA 4.0' })).toBeNull();
  });
});
