import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { server } from '$mocks/server.ts';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { mediaParentalGuideQuery } from './mediaParentalGuideQuery.ts';

const MediaParentalGuideMock = {
  id: 'tt14693272',
  title: 'Freedom Day',
  categories: {
    sex_nudity: {
      categoryId: 'NUDITY',
      label: 'Sex & Nudity',
      severity: 'NONE',
      severityLabel: 'None',
      votes: {
        none: 10,
        mild: 1,
        moderate: 0,
        severe: 0,
      },
      totalVotes: 11,
    },
    violence_gore: {
      categoryId: 'VIOLENCE',
      label: 'Violence & Gore',
      severity: 'MODERATE',
      severityLabel: 'Moderate',
      votes: {
        none: 1,
        mild: 4,
        moderate: 12,
        severe: 2,
      },
      totalVotes: 19,
    },
  },
};

describe('mediaParentalGuideQuery', () => {
  it('should be disabled without an IMDb id', () => {
    const query = mediaParentalGuideQuery({ imdbId: null });

    expect(query.enabled).to.equal(false);
  });

  it('should query for a media parental guide by IMDb id', async () => {
    server.use(
      http.get(
        `http://localhost/v3/media/imdb/${MediaParentalGuideMock.id}/parental-guide`,
        () => HttpResponse.json(MediaParentalGuideMock),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          mediaParentalGuideQuery({ imdbId: MediaParentalGuideMock.id }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MediaParentalGuideMock);
  });

  it('should return null when a media parental guide is unavailable', async () => {
    server.use(
      http.get(
        `http://localhost/v3/media/imdb/${MediaParentalGuideMock.id}/parental-guide`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          mediaParentalGuideQuery({ imdbId: MediaParentalGuideMock.id }),
        ),
      mapper: (response) => response?.data,
      waitFor: (response) => response === null,
    });

    expect(result).to.equal(null);
  });
});
