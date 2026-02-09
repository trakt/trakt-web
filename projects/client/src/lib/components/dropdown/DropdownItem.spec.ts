import DropdownItem from './DropdownItem.svelte';

import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';

describe('DropdownItem', () => {
  it('should render as a link', async () => {
    setAuthorization(true);

    renderComponent(DropdownItem, {
      props: {
        href: '/test-link',
        children: createRawSnippet(() => ({
          render: () => '<span>Test Link</span>',
        })),
      },
    });

    await waitFor(() => {
      const linkElement = screen.getByRole('link', { name: /test link/i });
      expect(linkElement).toBeInTheDocument();
      expect(linkElement).toHaveAttribute('href', '/test-link');
    });
  });

  it('should render normally', async () => {
    renderComponent(DropdownItem, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<span>Normal Item</span>',
        })),
      },
    });

    await waitFor(() => {
      const listItemElement = screen.getByRole('listitem');
      expect(listItemElement).toBeInTheDocument();
    });
  });

  it('should apply default color', async () => {
    renderComponent(DropdownItem, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<span>Default Color Item</span>',
        })),
      },
    });

    await waitFor(() => {
      const listItemElement = screen.getByRole('listitem');
      expect(listItemElement).toHaveAttribute('data-color', 'purple');
    });
  });

  it('should apply red color', async () => {
    renderComponent(DropdownItem, {
      props: {
        color: 'red',
        children: createRawSnippet(() => ({
          render: () => '<span>Red Color Item</span>',
        })),
      },
    });

    await waitFor(() => {
      const listItemElement = screen.getByRole('listitem');
      expect(listItemElement).toHaveAttribute('data-color', 'red');
    });
  });

  it('should handle tabindex correctly', async () => {
    renderComponent(DropdownItem, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<span>Item</span>',
        })),
      },
    });

    await waitFor(() => {
      const listItemElement = screen.getByRole('listitem');
      expect(listItemElement).toHaveAttribute('tabindex', '-1');
    });
  });

  it('should have tabindex 0 when interactive', async () => {
    renderComponent(DropdownItem, {
      props: {
        onclick: () => {},
        children: createRawSnippet(() => ({
          render: () => '<span>Item</span>',
        })),
      },
    });

    await waitFor(() => {
      const listItemElement = screen.getByRole('listitem');
      expect(listItemElement).toHaveAttribute('tabindex', '0');
    });
  });

  it('should render an icon', async () => {
    const iconContent = 'This is an icon';
    renderComponent(DropdownItem, {
      props: {
        onclick: () => {},
        children: createRawSnippet(() => ({
          render: () => '<span>Item</span>',
        })),
        icon: createRawSnippet(() => ({
          render: () => `<span>${iconContent}</span>`,
        })),
      },
    });

    await waitFor(() => {
      const iconElement = screen.getByText(iconContent);
      expect(iconElement).toBeInTheDocument();
    });
  });

  it('should apply flat style', async () => {
    renderComponent(DropdownItem, {
      props: {
        style: 'flat',
        children: createRawSnippet(() => ({
          render: () => '<span>flat item</span>',
        })),
      },
    });

    await waitFor(() => {
      const listItemElement = screen.getByRole('listitem');
      expect(listItemElement).toHaveAttribute('data-style', 'flat');
    });
  });
});
