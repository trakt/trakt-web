import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { MOCK_REALITY_CLAIMS } from './constants/MOCK_REALITY_CLAIMS.ts';
import RealityCheckClaims from './RealityCheckClaims.svelte';

describe('RealityCheckClaims', () => {
  it('should pair each claim with an on screen and a reality label', async () => {
    const { container } = renderComponent(RealityCheckClaims, {
      props: { claims: MOCK_REALITY_CLAIMS },
    });

    await screen.findAllByText('On screen');

    const terms = [...container.querySelectorAll('dt')].map(
      (term) => term.textContent,
    );
    expect(terms).toEqual(
      MOCK_REALITY_CLAIMS.flatMap(() => ['On screen', 'Reality']),
    );
    expect(container.querySelectorAll('dd')).toHaveLength(
      MOCK_REALITY_CLAIMS.length * 2,
    );
  });

  it('should render the claim text next to its label', async () => {
    const [claim] = MOCK_REALITY_CLAIMS;
    renderComponent(RealityCheckClaims, { props: { claims: [claim!] } });

    expect(
      (await screen.findByText(claim!.onScreen)).closest('dd'),
    ).toHaveClass('on-screen');
    expect(screen.getByText(claim!.documented).closest('dd')).toHaveClass(
      'documented',
    );
  });

  it('should drop the inline bold prefixes', async () => {
    const { container } = renderComponent(RealityCheckClaims, {
      props: { claims: MOCK_REALITY_CLAIMS },
    });

    await screen.findAllByText('Reality');

    expect(container).not.toHaveTextContent('On screen:');
    expect(container).not.toHaveTextContent('Documented:');
  });
});
