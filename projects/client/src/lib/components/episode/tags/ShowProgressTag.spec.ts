import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import ShowProgressTag from './ShowProgressTag.svelte';

const children = createRawSnippet(() => ({
  render: () => 'Custom Text',
}));

describe('ShowProgressTag', () => {
  it('should set correct progress width with 0%', () => {
    render(ShowProgressTag, { props: { total: 100, progress: 0, children } });
    const element = screen.getByRole('progressbar');
    expect(element.style.getPropertyValue('--progress-width')).toBe('0%');
  });

  it('should set correct progress width with 50%', () => {
    render(ShowProgressTag, { props: { total: 100, progress: 50, children } });
    const element = screen.getByRole('progressbar');
    expect(element.style.getPropertyValue('--progress-width')).toBe('50%');
  });

  it('should set correct progress width with 100%', () => {
    render(ShowProgressTag, { props: { total: 100, progress: 100, children } });
    const element = screen.getByRole('progressbar');
    expect(element.style.getPropertyValue('--progress-width')).toBe('100%');
  });

  it('should handle decimal progress values', () => {
    render(ShowProgressTag, {
      props: { total: 100, progress: 33.33, children },
    });
    const element = screen.getByRole('progressbar');
    expect(element.style.getPropertyValue('--progress-width')).toBe('33.33%');
  });
});
