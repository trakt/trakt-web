import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { prefixPathWithBaseUrl } from './prefixPathWithBaseUrl.ts';

export function prefixBuilderPaths<
  T extends Record<string, (arg: string) => string>,
>(
  builder: T,
): { [K in keyof T]: (arg?: string) => string } {
  return Object.fromEntries(
    Object.entries(builder).map(([key, fn]) => [
      key,
      (...args: Parameters<typeof fn>) => prefixPathWithBaseUrl(fn(...args)),
    ]),
  ) as { [K in keyof T]: (...args: Parameters<T[K]>) => string };
}

const builder = {
  movieSummary: (slug: string) => UrlBuilder.movie(slug),
  showSummary: (slug: string) => UrlBuilder.show(slug),
  shows: () => UrlBuilder.shows(),
  movies: () => UrlBuilder.movies(),
};

export const TestUrlBuilder = prefixBuilderPaths(builder);
