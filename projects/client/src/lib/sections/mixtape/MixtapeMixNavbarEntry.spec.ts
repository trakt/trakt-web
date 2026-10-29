import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import MixtapeMixNavbarEntry from './MixtapeMixNavbarEntry.svelte';

describe('MixtapeMixNavbarEntry', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should wait for a pick before offering the mix', async () => {
    renderComponent(MixtapeMixNavbarEntry, { props: {}, withFilters: true });

    const entry = await screen.findByText('Mix it');

    expect(entry.closest('a')).toBeNull();
    expect(entry.closest('[aria-disabled="true"]')).not.toBeNull();
    expect(document.querySelector('.trakt-mixtape-mix-entry')).toHaveAttribute(
      'data-state',
      'empty',
    );
  });
});
