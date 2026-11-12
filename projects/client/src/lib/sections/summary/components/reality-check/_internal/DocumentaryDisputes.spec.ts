import type { DocumentaryDispute } from '$lib/requests/models/DocumentaryCheck.ts';
import { DocumentaryCheckVipMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckVipMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import DocumentaryDisputes from './DocumentaryDisputes.svelte';

const [expert, press] = DocumentaryCheckVipMappedMock.disputes as [
  DocumentaryDispute,
  DocumentaryDispute,
];

describe('DocumentaryDisputes', () => {
  it('should label the list and pair each claim with who disputed it', async () => {
    const { container } = renderComponent(DocumentaryDisputes, {
      props: { disputes: [expert] },
    });

    expect(await screen.findByText('Disputed claims')).toBeVisible();

    const terms = [...container.querySelectorAll('dt')].map(
      (term) => term.textContent,
    );
    expect(terms).toEqual(['The film says', 'Disputed by']);
    expect(screen.getByText(expert.claim)).toBeVisible();
    expect(screen.getByText(expert.by)).toBeVisible();
  });

  it('should name the source as a grey chip', async () => {
    const { container } = renderComponent(DocumentaryDisputes, {
      props: { disputes: [expert, press] },
    });

    expect(await screen.findByText('Expert')).toBeVisible();
    expect(screen.getByText('Press')).toBeVisible();
    expect(
      [...container.querySelectorAll('.trakt-reality-chip')].map((chip) =>
        chip.getAttribute('data-tone'),
      ),
    ).toEqual(['neutral', 'neutral']);
  });

  it('should show the year only when there is one', async () => {
    const { container } = renderComponent(DocumentaryDisputes, {
      props: {
        disputes: [
          { ...expert, year: 2021 },
          { ...press, year: null },
        ],
      },
    });

    await screen.findByText('Disputed claims');

    const years = container.querySelectorAll('.dispute-year');
    expect(years).toHaveLength(1);
    expect(years[0]).toHaveTextContent('2021');
  });

  it("should show the film's reply only when there is one", async () => {
    renderComponent(DocumentaryDisputes, {
      props: { disputes: [{ ...expert, reply: null }] },
    });

    await screen.findByText('Disputed claims');

    expect(screen.queryByText("Film's reply")).toBeNull();
  });

  it("should show the film's reply under the dispute", async () => {
    renderComponent(DocumentaryDisputes, {
      props: { disputes: [{ ...press, reply: 'We stand by the footage.' }] },
    });

    expect(await screen.findByText("Film's reply")).toBeVisible();
    expect(screen.getByText('We stand by the footage.')).toBeVisible();
  });

  it('should list major disputes before minor ones', async () => {
    const { container } = renderComponent(DocumentaryDisputes, {
      props: {
        disputes: [
          { ...expert, claim: 'minor claim', impact: 'minor' },
          { ...press, claim: 'major claim', impact: 'major' },
        ],
      },
    });

    await screen.findByText('Disputed claims');

    expect(
      [...container.querySelectorAll('.dispute')].map((row) =>
        row.getAttribute('data-impact'),
      ),
    ).toEqual(['major', 'minor']);
  });

  it('should keep the shipped order within the same impact', async () => {
    const { container } = renderComponent(DocumentaryDisputes, {
      props: {
        disputes: [
          { ...expert, claim: 'first major', impact: 'major' },
          { ...press, claim: 'second major', impact: 'major' },
        ],
      },
    });

    await screen.findByText('Disputed claims');

    expect(
      [...container.querySelectorAll('.dispute .claim')].map(
        (claim) => claim.textContent,
      ),
    ).toEqual(['first major', 'second major']);
  });

  it('should quiet a minor dispute with the minor note', async () => {
    renderComponent(DocumentaryDisputes, {
      props: { disputes: [{ ...expert, impact: 'minor' }] },
    });

    expect(await screen.findByText('minor')).toBeVisible();
  });

  it('should show no minor note for a major dispute', async () => {
    renderComponent(DocumentaryDisputes, {
      props: { disputes: [{ ...expert, impact: 'major' }] },
    });

    await screen.findByText('Disputed claims');

    expect(screen.queryByText('minor')).toBeNull();
  });
});
