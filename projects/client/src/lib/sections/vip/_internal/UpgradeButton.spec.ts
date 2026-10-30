import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import type { VipPlan } from './models/VipPlan.ts';
import UpgradeButton from './UpgradeButton.svelte';

const plan: VipPlan = {
  type: 'monthly',
  monthlyPrice: 4.99,
  totalPrice: 4.99,
  durationInMonths: 1,
  isPopular: false,
  discount: null,
};

describe('UpgradeButton', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should explain when the checkout request fails', async () => {
    const user = userEvent.setup();
    server.use(
      http.post('http://localhost/vip/stripe/create', () =>
        HttpResponse.error(),
      ),
    );

    renderComponent(UpgradeButton, { props: { plan, label: 'Upgrade' } });
    await user.click(await screen.findByRole('button', { name: 'Upgrade' }));

    expect(
      await screen.findByText("Couldn't start checkout"),
    ).toBeInTheDocument();
  });

  it('should explain when the checkout responds with an error status', async () => {
    const user = userEvent.setup();
    server.use(
      http.post(
        'http://localhost/vip/stripe/create',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    renderComponent(UpgradeButton, { props: { plan, label: 'Upgrade' } });
    await user.click(await screen.findByRole('button', { name: 'Upgrade' }));

    expect(
      await screen.findByText("Couldn't start checkout"),
    ).toBeInTheDocument();
  });
});
