import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapListedMovieResponseToListItem } from '$lib/requests/_internal/mapListItemResponseToListItem.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { DEFAULT_PAGE_SIZE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

type ListMovieItemsParams =
  & {
    id: number;
    page?: number;
    limit?: number;
  }
  & ApiParams;

export const ListedMovieSchema = ListItemSchemaFactory(MovieEntrySchema);
export type ListedMovie = z.infer<typeof ListedMovieSchema>;

const listMovieItemsRequest = (
  { fetch, id, limit = DEFAULT_PAGE_SIZE, page = 1 }: ListMovieItemsParams,
) =>
  api({ fetch })
    .lists
    .items
    .movies({
      params: {
        id: `${id}`,
      },
      query: {
        extended: 'full,images',
        page,
        limit,
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch list movie items');
      }

      return response.body;
    });

export const listMovieItemsQuery = defineQuery({
  key: 'listMovieItems',
  invalidations: [],
  dependencies: (params) => [params.id, params.limit, params.page],
  request: listMovieItemsRequest,
  mapper: (data) => data.map(mapListedMovieResponseToListItem),
  schema: ListedMovieSchema.array(),
  ttl: time.minutes(30),
});
