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
        <div role="option" aria-selected="false">Item 1</div>
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
      const dropdownButton = screen.getByRole('combobox', {
        name: /click here/i,
      });
      await fireEvent.click(dropdownButton);
      vi.advanceTimersToNextFrame();

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });
  });

  it('should close the dropdown when clicking outside', async () => {
    renderComponent(DropdownList, {
      props: {
        ...defaultProps,
      },
    });

    await waitFor(async () => {
      const dropdownButton = screen.getByRole('combobox', {
        name: /click here/i,
      });

      await fireEvent.click(dropdownButton);
      vi.advanceTimersToNextFrame();

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();

      await fireEvent.click(window);
      vi.advanceTimersToNextFrame();

      await waitForElementToBeRemoved(screen.getByRole('listbox'));
    });
  });
});
