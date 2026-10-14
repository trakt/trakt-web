import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { serveUnusedAccount } from '$test/beds/next-steps/serveUnusedAccount.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import DashboardCallout from './DashboardCallout.svelte';

describe('DashboardCallout', () => {
  beforeEach(() => {
    setAuthorization(true);
    serveUnusedAccount();
  });

  it('should show the next steps card while steps remain', async () => {
    renderComponent(DashboardCallout, { props: {} });

    const card = await screen.findByRole('link', {
      name: /^Get more out of Trakt, \d of 3 done$/,
    });

    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent(/\d\/3/);
    expect(card.getAttribute('href')).toContain('view=next-steps');
  });
});
