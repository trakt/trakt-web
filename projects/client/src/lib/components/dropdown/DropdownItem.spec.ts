import DropdownItem from './DropdownItem.svelte';

import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';

describe('DropdownItem', () => {
  it('should render as a link', () => {
    render(DropdownItem, {
      props: {
        href: '/test-link',
        children: createRawSnippet(() => ({
          render: () => '<span>Test Link</span>',
        })),
      },
    });

    const linkElement = screen.getByRole('link', { name: /test link/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test-link');
  });

  it('should render normally', () => {
    render(DropdownItem, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<span>Normal Item</span>',
        })),
      },
    });

    const listItemElement = screen.getByRole('listitem');
    expect(listItemElement).toBeInTheDocument();
  });

  it('should apply default color', () => {
    render(DropdownItem, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<span>Default Color Item</span>',
        })),
      },
    });

    const listItemElement = screen.getByRole('listitem');
    expect(listItemElement).toHaveAttribute('data-color', 'purple');
  });

  it('should apply red color', () => {
    render(DropdownItem, {
      props: {
        color: 'red',
        children: createRawSnippet(() => ({
          render: () => '<span>Red Color Item</span>',
        })),
      },
    });

    const listItemElement = screen.getByRole('listitem');
    expect(listItemElement).toHaveAttribute('data-color', 'red');
  });

  it('should handle tabindex correctly', () => {
    render(DropdownItem, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<span>Item</span>',
        })),
      },
    });

    const listItemElement = screen.getByRole('listitem');
    expect(listItemElement).toHaveAttribute('tabindex', '-1');
  });

  it('should have tabindex 0 when interactive', () => {
    render(DropdownItem, {
      props: {
        onclick: () => {},
        children: createRawSnippet(() => ({
          render: () => '<span>Item</span>',
        })),
      },
    });

    const listItemElement = screen.getByRole('listitem');
    expect(listItemElement).toHaveAttribute('tabindex', '0');
  });
});
