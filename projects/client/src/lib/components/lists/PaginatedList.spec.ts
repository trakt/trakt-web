import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { BehaviorSubject } from 'rxjs';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import PaginatedList from './PaginatedList.svelte';

describe('PaginatedList', () => {
  it('should mount completed content only after the final nonempty page loads', async () => {
    const list = new BehaviorSubject<{ key: string }[]>([]);
    const isLoading = new BehaviorSubject(true);
    const hasNextPage = new BehaviorSubject(false);
    const mountCompleted = vi.fn();
    renderComponent(PaginatedList, {
      props: {
        type: 'media',
        useList: () => ({
          list,
          isLoading,
          hasNextPage,
          fetchNextPage: vi.fn(async () => {}),
        }),
        items: createRawSnippet(() => ({
          render: () => '<div>List items</div>',
        })),
        completed: createRawSnippet(() => ({
          render: () => '<div>Completed content</div>',
          setup: mountCompleted,
        })),
      },
    });

    expect(mountCompleted).not.toHaveBeenCalled();
    hasNextPage.next(true);
    list.next([{ key: 'first' }]);
    isLoading.next(false);
    await waitFor(() =>
      expect(screen.getByText('List items')).toBeInTheDocument()
    );
    expect(mountCompleted).not.toHaveBeenCalled();

    isLoading.next(true);
    hasNextPage.next(false);
    list.next([{ key: 'first' }, { key: 'last' }]);
    await waitFor(() =>
      expect(screen.queryByText('Completed content')).not.toBeInTheDocument()
    );
    expect(mountCompleted).not.toHaveBeenCalled();

    isLoading.next(false);
    expect(await screen.findByText('Completed content')).toBeInTheDocument();
    expect(mountCompleted).toHaveBeenCalledOnce();

    isLoading.next(true);
    await waitFor(() =>
      expect(screen.queryByText('Completed content')).not.toBeInTheDocument()
    );
    list.next([]);
    isLoading.next(false);
    await waitFor(() =>
      expect(screen.queryByText('Completed content')).not.toBeInTheDocument()
    );
    expect(mountCompleted).toHaveBeenCalledOnce();
  });
});
