import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import PasskeyRow from './PasskeyRow.svelte';

describe('PasskeyRow', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should link to the passkey page on the auth host', async () => {
    renderComponent(PasskeyRow, { props: {} });

    const link = await screen.findByRole('link', { name: 'Manage passkey' });

    expect(link).toHaveAttribute('href', 'https://auth.trakt.tv/passkey');
  });

  it('should describe the passkey', async () => {
    renderComponent(PasskeyRow, { props: {} });

    expect(await screen.findByText('Passkey')).toBeInTheDocument();
    expect(
      screen.getByText('Sign in with your fingerprint, face or screen lock.'),
    ).toBeInTheDocument();
  });
});
