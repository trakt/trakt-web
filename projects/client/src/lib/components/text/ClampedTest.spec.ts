import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import ClampedText from './ClampedText.svelte';

describe('ClampedText', () => {
  it('should render text without clamp when text is short', () => {
    render(ClampedText, {
      props: {
        label: 'Title',
        children: createRawSnippet(() => ({
          render: () => '<span>Short text</span>',
        })),
      },
    });

    expect(screen.getByText('Short text')).toBeInTheDocument();
  });

  it('should render text when it is very long', () => {
    const veryLongText = Array.from(
      { length: 1000 },
      () => 'Long text that exceeds max lines',
    ).join(' ');

    render(ClampedText, {
      props: {
        label: 'Title',
        children: createRawSnippet(() => ({
          render: () => `<container>${veryLongText}</container>`,
        })),
      },
    });

    const element = screen.getByText(veryLongText);
    expect(element).toBeInTheDocument();
  });

  it('should apply custom class when provided', () => {
    render(ClampedText, {
      props: {
        label: 'Title',
        children: createRawSnippet(() => ({
          render: () => '<span>Short text</span>',
        })),
        classList: 'custom-class',
      },
    });

    const paragraph = screen.getByRole('paragraph');
    expect(paragraph).toHaveClass('custom-class');
  });

  it('should have line-clamp properties set on container when collapsed', () => {
    const veryLongText = Array.from(
      { length: 1000 },
      () => 'Long text that exceeds max lines',
    ).join(' ');

    render(ClampedText, {
      props: {
        label: 'Title',
        children: createRawSnippet(() => ({
          render: () => `<container>${veryLongText}</container>`,
        })),
      },
    });

    const paragraph = screen.getByRole('paragraph');
    expect(paragraph).toHaveStyle({
      display: '-webkit-box',
      '-webkit-line-clamp': '3',
      'line-clamp': '3',
      overflow: 'hidden',
    });
  });
});
