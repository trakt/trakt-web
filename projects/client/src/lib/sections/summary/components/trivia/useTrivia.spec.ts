import { getLocale } from '$lib/features/i18n/index.ts';
import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { combineLatest } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useTrivia } from './useTrivia.ts';

type Fact = {
  fact_id: string;
  category: 'bts' | 'cast_n_crew';
  text: string;
  order: number;
  spoiler: boolean;
};

const facts: Fact[] = [
  {
    fact_id: 'a',
    category: 'bts',
    text: 'Safe fact',
    order: 1,
    spoiler: false,
  },
  {
    fact_id: 'b',
    category: 'cast_n_crew',
    text: 'Spoiler fact',
    order: 2,
    spoiler: true,
  },
  {
    fact_id: 'c',
    category: 'bts',
    text: 'Another safe',
    order: 3,
    spoiler: false,
  },
];

function serveTrivia({
  type,
  slug,
  items,
  summary = [],
}: {
  type: 'movie' | 'show';
  slug: string;
  items: Fact[];
  summary?: string[];
}) {
  server.use(
    http.get(
      `http://localhost/v3/media/${type}/${slug}/info/5/version/2`,
      ({ request }) => {
        const locale = new URL(request.url).searchParams.get('locale');

        return locale === getLocale()
          ? HttpResponse.json({ items, summary })
          : new HttpResponse(null, { status: 400 });
      },
    ),
  );
}

describe('store: useTrivia', () => {
  it('should only show spoiler facts in the spoilers variant', async () => {
    serveTrivia({ type: 'movie', slug: 'trivia-movie', items: facts });

    const result = await runQuery({
      factory: () =>
        useTrivia({ slug: 'trivia-movie', type: 'movie', variant: 'spoilers' })
          .list,
      waitFor: (list) => list.length === 1,
    });

    expect(result.map((trivia) => trivia.text)).to.deep.equal(['Spoiler fact']);
  });

  it('should hide spoiler facts in the no-spoilers variant', async () => {
    serveTrivia({ type: 'show', slug: 'trivia-show', items: facts });

    const result = await runQuery({
      factory: () =>
        useTrivia({
          slug: 'trivia-show',
          type: 'show',
          variant: 'no-spoilers',
        }).list,
      waitFor: (list) => list.length === 2,
    });

    expect(result.map((trivia) => trivia.text)).to.deep.equal([
      'Safe fact',
      'Another safe',
    ]);
  });

  it('should keep every fact when none is a spoiler', async () => {
    serveTrivia({
      type: 'movie',
      slug: 'safe-movie',
      items: facts.filter((fact) => !fact.spoiler),
    });

    const result = await runQuery({
      factory: () => {
        const { list, hasSpoilers } = useTrivia({
          slug: 'safe-movie',
          type: 'movie',
          variant: 'spoilers',
        });

        return combineLatest({ list, hasSpoilers });
      },
      waitFor: ({ list }) => list.length > 0,
    });

    expect(result.hasSpoilers).to.equal(false);
    expect(result.list).to.have.length(2);
  });

  it('should list each category once', async () => {
    serveTrivia({
      type: 'movie',
      slug: 'category-movie',
      items: facts.filter((fact) => !fact.spoiler),
    });

    const result = await runQuery({
      factory: () =>
        useTrivia({
          slug: 'category-movie',
          type: 'movie',
          variant: 'no-spoilers',
        }).categories,
      waitFor: (categories) => categories.length > 0,
    });

    expect(result).to.deep.equal(['bts']);
  });

  it('should expose the summary and spoiler flag', async () => {
    serveTrivia({
      type: 'show',
      slug: 'summary-show',
      items: facts,
      summary: ['One line'],
    });

    const result = await runQuery({
      factory: () => {
        const { summary, hasSpoilers } = useTrivia({
          slug: 'summary-show',
          type: 'show',
          variant: 'no-spoilers',
        });

        return combineLatest({ summary, hasSpoilers });
      },
      waitFor: ({ summary, hasSpoilers }) => summary.length > 0 && hasSpoilers,
    });

    expect(result.summary).to.deep.equal(['One line']);
    expect(result.hasSpoilers).to.equal(true);
  });
});
