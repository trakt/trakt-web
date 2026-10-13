import { ConfirmationType } from '$lib/features/confirmation/models/ConfirmationType.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import DeleteAccountStats from './DeleteAccountStats.svelte';

const props = {
  params: {
    type: ConfirmationType.DeleteAccount as const,
    username: 'entropymanagement',
  },
};

describe('DeleteAccountStats', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should show years together, hours watched and plays logged', async () => {
    renderComponent(DeleteAccountStats, { props });

    expect(await screen.findByText('Years together')).toBeInTheDocument();
    expect(await screen.findByText('4,333')).toBeInTheDocument();
    expect(screen.getByText('Hours watched')).toBeInTheDocument();
    expect(screen.getByText('6,100')).toBeInTheDocument();
    expect(screen.getByText('Plays logged')).toBeInTheDocument();
  });

  it('should keep only the years when the stats are not available', async () => {
    server.use(
      http.get(
        'http://localhost/users/me/stats',
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    renderComponent(DeleteAccountStats, { props });

    expect(await screen.findByText('Years together')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Hours watched')).not.toBeInTheDocument();
    });
    expect(screen.queryByText('Plays logged')).not.toBeInTheDocument();
  });
});
