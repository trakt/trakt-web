// @ts-ignore TODO: (@seferturan): fix typings in vs code
import DropdownList from './DropdownList.svelte';

import type { TraktDropdownListProps } from '$lib/components/dropdown/TraktDropdownListProps.ts';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';

describe('DropdownList', () => {
  const defaultProps: TraktDropdownListProps = {
    items: createRawSnippet(() => ({
      render: () => `
        <li>Item 1</li>
      `,
    })),
    children: createRawSnippet(() => ({
      render: () => 'Click Here',
    })),
    label: 'click here',
  };

  it('should render the dropdown list', async () => {
    render(DropdownList, {
      props: {
        ...defaultProps,
      },
    });

    const dropdownButton = screen.getByRole('button', {
      name: /click here/i,
    });
    await fireEvent.click(dropdownButton);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(1);
  });

  it('should close the dropdown when clicking outside', async () => {
    render(DropdownList, {
      props: {
        ...defaultProps,
      },
    });

    const dropdownButton = screen.getByRole('button', {
      name: /click here/i,
    });

    await fireEvent.click(dropdownButton);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    await fireEvent.click(window);
    await waitFor(() => {
      expect(list).not.toBeInTheDocument();
    });
  });

  it('should close the dropdown when clicking an item', async () => {
    render(DropdownList, {
      props: {
        ...defaultProps,
      },
    });

    const dropdownButton = screen.getByRole('button', {
      name: /click here/i,
    });

    await fireEvent.click(dropdownButton);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const item = screen.getByRole('listitem');
    await fireEvent.click(item);
    await waitFor(() => {
      expect(list).not.toBeInTheDocument();
    });
  });
});
