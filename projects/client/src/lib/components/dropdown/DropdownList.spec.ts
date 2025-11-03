import DropdownList from './DropdownList.svelte';

import { renderComponent } from '$test/beds/component/renderComponent.ts';
import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TraktDropdownListProps } from './TraktDropdownListProps.ts';

describe('DropdownList', () => {
  const defaultProps: TraktDropdownListProps = {
    items: createRawSnippet(() => ({
      render: () => `
        <li>Item 1</li>
      `,
    })),
    children: createRawSnippet(() => ({
      render: () => '<span>Click Here<span>',
    })),
    label: 'click here',
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
  });

  it('should render the dropdown list', async () => {
    renderComponent(DropdownList, {
      props: {
        ...defaultProps,
      },
    });

    await waitFor(async () => {
      const dropdownButton = screen.getByRole('button', {
        name: /click here/i,
      });
      await fireEvent.click(dropdownButton);
      vi.advanceTimersToNextFrame();

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(1);
    });
  });

  it('should close the dropdown when clicking outside', async () => {
    renderComponent(DropdownList, {
      props: {
        ...defaultProps,
      },
    });

    await waitFor(async () => {
      const dropdownButton = screen.getByRole('button', {
        name: /click here/i,
      });

      await fireEvent.click(dropdownButton);
      vi.advanceTimersToNextFrame();

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      await fireEvent.click(window);
      vi.advanceTimersToNextFrame();

      await waitForElementToBeRemoved(screen.getByRole('list'));
    });
  });

  it('should close the dropdown when clicking an item', async () => {
    renderComponent(DropdownList, {
      props: {
        ...defaultProps,
      },
    });

    await waitFor(async () => {
      const dropdownButton = screen.getByRole('button', {
        name: /click here/i,
      });

      await fireEvent.click(dropdownButton);
      vi.advanceTimersToNextFrame();

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const item = screen.getByRole('listitem');
      await fireEvent.click(item);
      vi.advanceTimersToNextFrame();

      await waitForElementToBeRemoved(list);
    });
  });
});
