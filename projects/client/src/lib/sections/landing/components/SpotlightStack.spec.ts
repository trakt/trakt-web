import { ShowsTrendingMappedMock } from '$mocks/data/shows/mapped/ShowsTrendingMappedMock.ts';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SpotlightStack from './SpotlightStack.svelte';

describe('SpotlightStack', () => {
  it('should render a placeholder stack and caption while items are loading', () => {
    const { container } = render(SpotlightStack, {
      props: { items: [], active: 0 },
    });

    expect(container.querySelectorAll('.spotlight-card')).toHaveLength(3);
    expect(container.querySelectorAll('.spotlight-line')).toHaveLength(2);
    expect(screen.getByText('Trending now')).toBeInTheDocument();
  });

  it('should replace the placeholders with the active item once items arrive', () => {
    const [active] = ShowsTrendingMappedMock;
    const { container } = render(SpotlightStack, {
      props: { items: ShowsTrendingMappedMock, active: 0 },
    });

    expect(container.querySelectorAll('.spotlight-placeholder')).toHaveLength(
      0,
    );
    expect(container.querySelectorAll('.spotlight-card')).toHaveLength(
      ShowsTrendingMappedMock.length,
    );
    expect(screen.getByText(active?.title ?? '')).toBeInTheDocument();
  });
});
