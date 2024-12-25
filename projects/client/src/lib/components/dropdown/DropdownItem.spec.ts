// @ts-ignore TODO: (@seferturan): fix typings in vs code
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
          render: () => 'Test Link',
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
          render: () => 'Normal Item',
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
          render: () => 'Default Color Item',
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
          render: () => 'Red Color Item',
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
          render: () => 'Item',
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
          render: () => 'Item',
        })),
      },
    });

    const listItemElement = screen.getByRole('listitem');
    expect(listItemElement).toHaveAttribute('tabindex', '0');
  });
});
