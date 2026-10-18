import { SmartListDraftsSummaryMappedMock } from '$mocks/data/users/mapped/SmartListDraftsSummaryMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SmartListNudgeBarContent from './SmartListNudgeBarContent.svelte';

const FIRST_LIST_SLUG = SmartListDraftsSummaryMappedMock.lists[0]!.slug;

async function renderBar(onDismiss = vi.fn()) {
  renderComponent(SmartListNudgeBarContent, {
    props: { summary: SmartListDraftsSummaryMappedMock, onDismiss },
  });

  await screen.findByRole('button', { name: 'Review' });

  return { onDismiss };
}

describe('component: SmartListNudgeBarContent', () => {
  it('should start collapsed with the count of convertible lists', async () => {
    await renderBar();

    expect(
      screen.getByText('3 of your lists can update themselves'),
    ).toBeInTheDocument();
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

  it('should link each list to its smart list comparison', async () => {
    const user = userEvent.setup();
    setAuthorization(true);
    await renderBar();

    await user.click(screen.getByRole('button', { name: 'Review' }));

    expect(
      screen.getByRole('link', { name: 'Turn Silos into a smart list' }),
    ).toHaveAttribute('href', `/lists/smart/convert/${FIRST_LIST_SLUG}`);
  });
});
