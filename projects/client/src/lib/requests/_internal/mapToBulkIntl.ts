import type {
  BulkIntl,
  BulkIntlResponse,
} from '$lib/requests/models/BulkIntl.ts';

function toTitleMap(
  bucket: BulkIntlResponse['movie' | 'show' | 'episode'],
): Map<number, string> {
  const result = new Map<number, string>();

  for (const [id, value] of Object.entries(bucket)) {
    const title = value.title;
    if (title == null || title === '') continue;

    const numericId = Number(id);
    if (!Number.isFinite(numericId)) continue;

    result.set(numericId, title);
  }

  return result;
}

export function mapToBulkIntl(response: BulkIntlResponse): BulkIntl {
  return {
    movie: toTitleMap(response.movie),
    show: toTitleMap(response.show),
    episode: toTitleMap(response.episode),
  };
}
