import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import {
  type GifCategory,
  GifCategorySchema,
} from '$lib/requests/models/GifCategory.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { klipyProxyRequest } from './_internal/klipyProxyRequest.ts';

const KlipyCategoriesResponseSchema = z.object({
  data: z.object({
    categories: z.array(z.object({
      category: z.string(),
      query: z.string(),
      preview_url: z.string(),
    })),
  }),
});

type GifCategoriesParams = { customerId: string } & ApiParams;

const gifCategoriesRequest = ({ fetch, customerId }: GifCategoriesParams) =>
  klipyProxyRequest({
    path: 'gifs/categories',
    params: new URLSearchParams({ customer_id: customerId }),
    schema: KlipyCategoriesResponseSchema,
    fetch,
  });

export const gifCategoriesQuery = defineQuery({
  key: 'gifCategories',
  invalidations: [],
  dependencies: [],
  request: gifCategoriesRequest,
  mapper: (response): GifCategory[] =>
    response.body?.data.categories.map((category) => ({
      title: category.category,
      query: category.query,
      previewUrl: category.preview_url,
    })) ?? [],
  schema: z.array(GifCategorySchema),
  ttl: time.hours(12),
});
