import { ShowSiloSplitPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSplitPeopleMappedMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { showPeopleQuery } from './showPeopleQuery.ts';

describe('showPeopleQuery', () => {
  it('should query people for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showPeopleQuery({ slug: ShowSiloResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloPeopleMappedMock);
  });
  it('should request split credits separately for the people drawer', async () => {
    const params = { slug: ShowSiloResponseMock.ids.slug };
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(showPeopleQuery({ ...params, guestStars: true })),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloSplitPeopleMappedMock);
    expect(showPeopleQuery(params).queryKey).not.toEqual(
      showPeopleQuery({ ...params, guestStars: true }).queryKey,
    );
  });

  describe('character portraits', () => {
    const params = { slug: ShowSiloResponseMock.ids.slug };
    const portraitPath = `/portraits/show-${ShowSiloResponseMock.ids.trakt}-`;

    it('should not build portraits when the flag is off', async () => {
      const result = await runQuery({
        factory: () => createTestBedQuery(showPeopleQuery(params)),
        waitFor: (response) => response.isSuccess,
      });

      expect(JSON.stringify(result.data)).not.toContain('/portraits/');
    });

    it('should build show portraits for the cast when the flag is on', async () => {
      const result = await runQuery({
        factory: () =>
          createTestBedQuery(showPeopleQuery({ ...params, portraits: true })),
        waitFor: (response) => response.isSuccess,
      });

      expect(result.data?.cast.at(0)?.headshot.url.thumb).toContain(
        portraitPath,
      );
      expect(showPeopleQuery(params).queryKey).not.toEqual(
        showPeopleQuery({ ...params, portraits: true }).queryKey,
      );
    });

    it('should keep the cast on headshots when the id lookup fails', async () => {
      server.use(
        http.get(`http://localhost/shows/${params.slug}`, () =>
          HttpResponse.error(),
        ),
      );

      const result = await runQuery({
        factory: () =>
          createTestBedQuery(showPeopleQuery({ ...params, portraits: true })),
        waitFor: (response) => response.isSuccess,
      });

      expect(result.data?.cast.at(0)?.headshot.url.thumb).toContain('/people/');
    });
  });
});
