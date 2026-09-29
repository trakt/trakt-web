import type { YirDetail } from '$lib/requests/models/YirDetail.ts';
import { PLACEHOLDERS } from '$lib/utils/assets.ts';

type Media = 'shows' | 'movies';

function mediaUrls(detail: YirDetail, type: Media): string[] {
  const companies = type === 'shows' ? detail.networks : detail.studios;

  return [
    ...detail.mostWatched[type].slice(0, 1).map((item) =>
      item.entry.cover.url.medium
    ),
    ...detail.mostWatched[type].slice(1, 10).map((item) =>
      item.entry.poster.url.medium
    ),
    ...companies.slice(0, 10).map((company) => company.imageUrl ?? ''),
    ...detail.topRated[type].slice(0, 10).map((item) =>
      item.entry.poster.url.medium
    ),
    ...(detail.trends?.[type] ?? []).map((item) =>
      item.entry.poster.url.medium
    ),
  ];
}

export function collectYirImageUrls(detail: YirDetail | null): string[] {
  if (!detail) return [];

  const urls = [
    detail.firstWatched?.entry.cover.url.medium ?? '',
    ...mediaUrls(detail, 'shows'),
    ...mediaUrls(detail, 'movies'),
    detail.lastWatched?.entry.cover.url.medium ?? '',
    ...[
      ...(detail.thanks?.shows ?? []).slice(0, 3),
      ...(detail.thanks?.movies ?? []).slice(0, 3),
    ].map((entry) => entry.poster.url.medium),
  ];

  return [...new Set(urls)].filter((url) =>
    url !== '' && !PLACEHOLDERS.includes(url)
  );
}
