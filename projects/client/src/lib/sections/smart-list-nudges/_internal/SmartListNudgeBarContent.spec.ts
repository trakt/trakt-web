import { goto } from '$app/navigation';
import { SmartListDraftResponseMock } from '$mocks/data/users/response/SmartListDraftResponseMock.ts';
import { SmartListDraftsSummaryMappedMock } from '$mocks/data/users/mapped/SmartListDraftsSummaryMappedMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SmartListNudgeBarContent from './SmartListNudgeBarContent.svelte';

const FIRST_LIST_SLUG = SmartListDraftsSummaryMappedMock.lists[0]!.slug;

function serveDraft() {
  server.use(
    http.get(
      `http://localhost/users/me/lists/${FIRST_LIST_SLUG}/smart-list-draft`,
      () => HttpResponse.json(SmartListDraftResponseMock),
    ),
  );
}

async function renderBar(onDismiss = vi.fn()) {
  renderComponent(SmartListNudgeBarContent, {
    props: { summary: SmartListDraftsSummaryMappedMock, onDismiss },
  });

  await screen.findByRole('button', { name: 'Review' });

  return { onDismiss };
}

describe('component: SmartListNudgeBarContent', () => {
  beforeEach(() => {
    vi.mocked(goto).mockClear();
  });

  it('should start collapsed with the count of convertible lists', async () => {
    await renderBar();

    expect(screen.getByText('3 of your lists can update themselves'))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Review' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('should expand into one row per list and collapse again', async () => {
    const user = userEvent.setup();
    await renderBar();

    await user.click(screen.getByRole('button', { name: 'Review' }));

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Brings back 37 of 40')).toBeInTheDocument();
    expect(screen.getByText('Brings back 82 of 100')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Hide' }));

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('should fall back to the slug when a list has no name', async () => {
    const user = userEvent.setup();
    await renderBar();

    await user.click(screen.getByRole('button', { name: 'Review' }));

    expect(screen.getByText('slow-burn-sci-fi')).toBeInTheDocument();
  });

  it('should dismiss through the not now button', async () => {
    const user = userEvent.setup();
    const { onDismiss } = await renderBar();

    await user.click(screen.getByRole('button', { name: 'Not now' }));

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('should convert a list in one click and open the new smart list', async () => {
    const user = userEvent.setup();
    serveDraft();
    await renderBar();

    await user.click(screen.getByRole('button', { name: 'Review' }));
    await user.click(
      screen.getByRole('button', { name: 'Turn Silos into a smart list' }),
    );

    await waitFor(() =>
      expect(goto).toHaveBeenCalledWith('/lists/smart/view/new-smart-list')
    );
  });

  it('should stay on the page when the list has no draft', async () => {
    const user = userEvent.setup();
    server.use(
      http.get(
        `http://localhost/users/me/lists/${FIRST_LIST_SLUG}/smart-list-draft`,
        () => new HttpResponse(null, { status: 404 }),
      ),
    );
    await renderBar();

    await user.click(screen.getByRole('button', { name: 'Review' }));
    await user.click(
      screen.getByRole('button', { name: 'Turn Silos into a smart list' }),
    );

    await waitFor(() => expect(goto).not.toHaveBeenCalled());
  });
});
