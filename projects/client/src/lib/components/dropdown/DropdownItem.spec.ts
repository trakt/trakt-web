import DropdownItem from './DropdownItem.svelte';

import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { fireEvent, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';

describe('DropdownItem', () => {
  it('should render as an option', async () => {
    renderComponent(DropdownItem, {
      props: {
        children: createRawSnippet(() => ({
          render: () => '<span>Test Item</span>',
        })),
      },
    });

    await waitFor(() => {
      const optionElement = screen.getByRole('option', { name: /test item/i });
      expect(optionElement).toBeInTheDocument();
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
      const optionElement = screen.getByRole('option');
      expect(optionElement).toHaveAttribute('data-color', 'purple');
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
      const optionElement = screen.getByRole('option');
      expect(optionElement).toHaveAttribute('data-color', 'red');
    });
  });

  it('should call onclick when clicked', async () => {
    const handleClick = vi.fn();

    renderComponent(DropdownItem, {
      props: {
        onclick: handleClick,
        children: createRawSnippet(() => ({
          render: () => '<span>Item</span>',
        })),
      },
    });

    await waitFor(async () => {
      const optionElement = screen.getByRole('option');
      await fireEvent.click(optionElement);
      expect(handleClick).toHaveBeenCalled();
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
      const optionElement = screen.getByRole('option');
      expect(optionElement).toHaveAttribute('data-style', 'flat');
    });
  });
});
