import { FilterKey } from '$lib/features/filters/models/Filter.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ToggleFilter from './ToggleFilter.svelte';

describe('component: ToggleFilter', () => {
  it('should label the states as default, yes and no', async () => {
    renderComponent(ToggleFilter, {
      props: {
        filter: {
          label: () => 'Watched',
          key: FilterKey.IgnoreWatched,
          type: 'toggle',
          isInverted: true,
        },
      },
    });

    const radios = await screen.findAllByRole('radio');
    const labels = radios.map((radio) => radio.textContent?.trim());

    expect(labels).toEqual(['Default', 'Yes', 'No']);
  });
});
