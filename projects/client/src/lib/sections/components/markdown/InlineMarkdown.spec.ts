import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import InlineMarkdown from './InlineMarkdown.svelte';

describe('InlineMarkdown', () => {
  it('should render a markdown link as an anchor', () => {
    render(InlineMarkdown, {
      props: { text: 'Known for [Barbie](/movies/barbie-2023).' },
    });

    expect(screen.getByRole('link', { name: 'Barbie' })).toHaveAttribute(
      'href',
      '/movies/barbie-2023',
    );
  });

  it('should render plain text without links', () => {
    render(InlineMarkdown, {
      props: { text: 'An Australian actress.' },
    });

    expect(screen.getByText('An Australian actress.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should escape raw html', () => {
    render(InlineMarkdown, {
      props: { text: '<img src=x onerror=boom>' },
    });

    expect(document.querySelector('img')).toBeNull();
  });
});
