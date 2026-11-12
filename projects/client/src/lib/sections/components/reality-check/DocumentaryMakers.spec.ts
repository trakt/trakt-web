import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import DocumentaryMakers from './DocumentaryMakers.svelte';

describe('DocumentaryMakers', () => {
  it('should name who made the film and who funded it', async () => {
    renderComponent(DocumentaryMakers, {
      props: {
        makers: { madeBy: ['Example Films'], fundedBy: ['Example Foundation'] },
      },
    });

    expect(
      await screen.findByText(
        'Made by Example Films. Funded by Example Foundation.',
      ),
    ).toBeVisible();
  });

  it('should show no funded line when nobody is named as a funder', async () => {
    renderComponent(DocumentaryMakers, {
      props: { makers: { madeBy: ['Example Films'], fundedBy: [] } },
    });

    expect(await screen.findByText('Made by Example Films.')).toBeVisible();
    expect(screen.queryByText(/Funded/u)).toBeNull();
    expect(screen.queryByText(/disclosed/iu)).toBeNull();
  });

  it('should show no made line when nobody is named as a maker', async () => {
    renderComponent(DocumentaryMakers, {
      props: { makers: { madeBy: [], fundedBy: ['Example Foundation'] } },
    });

    expect(
      await screen.findByText('Funded by Example Foundation.'),
    ).toBeVisible();
    expect(screen.queryByText(/Made by/u)).toBeNull();
  });

  it('should render nothing when there is nobody to name', async () => {
    const { container } = renderComponent(DocumentaryMakers, {
      props: { makers: { madeBy: [], fundedBy: [] } },
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.querySelector('.trakt-documentary-makers')).toBeNull();
  });

  it('should join several makers into one list', async () => {
    renderComponent(DocumentaryMakers, {
      props: {
        makers: { madeBy: ['Alpha', 'Beta', 'Gamma'], fundedBy: [] },
      },
    });

    expect(
      await screen.findByText('Made by Alpha, Beta, and Gamma.'),
    ).toBeVisible();
  });
});
