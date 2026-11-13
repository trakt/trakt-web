import { DocumentaryCheckPublicMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckPublicMappedMock.ts';
import { DocumentaryCheckVipMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckVipMappedMock.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import DocumentaryCheckTab from './DocumentaryCheckTab.svelte';

function serveFreeUser() {
  server.use(
    http.get('http://localhost/users/settings', () =>
      HttpResponse.json({
        ...ExtendedUsersResponseMock,
        user: { ...ExtendedUsersResponseMock.user, vip: false, vip_ep: false },
      }),
    ),
  );
}

describe('DocumentaryCheckTab', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should lead with the pill, the sentence and who made and funded the film', async () => {
    renderComponent(DocumentaryCheckTab, {
      props: { documentaryCheck: DocumentaryCheckVipMappedMock },
    });

    expect(await screen.findByText('Widely disputed')).toBeVisible();
    expect(
      screen.getByText(DocumentaryCheckVipMappedMock.summary),
    ).toBeVisible();
    expect(
      screen.getByText('Made by Example Films. Funded by Example Foundation.'),
    ).toBeVisible();
  });

  it('should list the disputed claims under a hairline for VIP', async () => {
    const { container } = renderComponent(DocumentaryCheckTab, {
      props: { documentaryCheck: DocumentaryCheckVipMappedMock },
    });

    expect(await screen.findByText('Disputed claims')).toBeVisible();
    expect(
      container.querySelector('.documentary-hairline'),
    ).toBeInTheDocument();
    expect(container.querySelectorAll('.dispute')).toHaveLength(
      DocumentaryCheckVipMappedMock.disputes.length,
    );
  });

  it('should show no list and no label for VIP without disputes', async () => {
    const { container } = renderComponent(DocumentaryCheckTab, {
      props: { documentaryCheck: DocumentaryCheckPublicMappedMock },
    });

    await screen.findByText('Widely disputed');

    expect(screen.queryByText('Disputed claims')).toBeNull();
    expect(container.querySelector('.documentary-hairline')).toBeNull();
    expect(container.querySelector('.dispute')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('should show the upsell with a blurred preview instead of the list for free users', async () => {
    serveFreeUser();

    const { container } = renderComponent(DocumentaryCheckTab, {
      props: { documentaryCheck: DocumentaryCheckVipMappedMock },
    });

    expect(await screen.findByRole('link')).toBeVisible();
    expect(screen.getByText('Widely disputed')).toBeVisible();
    expect(container.querySelector('.documentary-hairline')).toBeNull();
    expect(
      container.querySelector('.documentary-preview[aria-hidden="true"]'),
    ).toBeInTheDocument();
    expect(
      [...container.querySelectorAll('.dispute')].every((row) =>
        row.closest('.documentary-preview'),
      ),
    ).toBe(true);
  });
});
