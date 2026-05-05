import { stretchedPercentage } from '$lib/utils/number/stretchedPercentage.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import ShowProgressTag from './ShowProgressTag.svelte';

const tags = createRawSnippet(() => ({
  render: () => '<span>Custom Text</span>',
}));

describe('ShowProgressTag', () => {
  const runtime = 25;

  it('should set correct progress width with 0%', async () => {
    renderComponent(ShowProgressTag, {
      props: { runtime, total: 100, progress: 0, tags },
    });
    await waitFor(() => {
      const element = screen.getByRole('progressbar');
      expect(element.style.getPropertyValue('--progress-width')).toBe('0%');
    });
  });

  it('should set correct progress width with 50%', async () => {
    renderComponent(ShowProgressTag, {
      props: { runtime, total: 100, progress: 50, tags },
    });
    await waitFor(() => {
      const element = screen.getByRole('progressbar');
      expect(element.style.getPropertyValue('--progress-width')).toBe('50%');
    });
  });

  it('should set correct progress width with 100%', async () => {
    renderComponent(ShowProgressTag, {
      props: { runtime, total: 100, progress: 100, tags },
    });
    await waitFor(() => {
      const element = screen.getByRole('progressbar');
      expect(element.style.getPropertyValue('--progress-width')).toBe('100%');
    });
  });

  it('should handle decimal progress values', async () => {
    const progress = 33.33;
    const total = 100;

    renderComponent(ShowProgressTag, {
      props: { runtime, total, progress, tags },
    });
    const expectedPercentage = stretchedPercentage({
      value: progress,
      total,
    });
    await waitFor(() => {
      const element = screen.getByRole('progressbar');
      expect(element.style.getPropertyValue('--progress-width')).toBe(
        `${expectedPercentage}%`,
      );
    });
  });
});
