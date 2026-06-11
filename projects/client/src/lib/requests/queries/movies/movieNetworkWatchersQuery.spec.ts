import { UserFollowingMappedMock } from "$mocks/data/users/mapped/UserFollowingMappedMock.ts";
import { MovieHereticResponseMock } from "$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts";
import { createTestBedQuery } from "$test/beds/query/createTestBedQuery.ts";
import { runQuery } from "$test/beds/query/runQuery.ts";
import { describe, expect, it } from "vitest";
import { movieNetworkWatchersQuery } from "./movieNetworkWatchersQuery.ts";

describe("movieNetworkWatchersQuery", () => {
  it("should query network watchers for Heretic (2024)", async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          movieNetworkWatchersQuery({
            slug: MovieHereticResponseMock.ids.slug,
            id: MovieHereticResponseMock.ids.trakt,
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserFollowingMappedMock);
  });
});
