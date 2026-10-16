import type {
  CollectionMinimalResponse,
  CollectionMinimalShowResponse,
} from '@trakt/api';

function toProviders(value: unknown): string[] {
  if (typeof value === 'string') {
    const providers = value.split('|').at(1) ?? '';
    return providers.split(',').filter(Boolean);
  }

  if (!value || typeof value !== 'object') return [];

  return Object.values(value).flatMap(toProviders);
}

export function toCollectionProviders(
  response: CollectionMinimalResponse | CollectionMinimalShowResponse | Nil,
): Record<string, ReadonlyArray<string>> {
  const entries = Object.entries(response ?? {})
    .filter(([key]) => Number.isInteger(Number(key)))
    .map(([key, value]): [string, ReadonlyArray<string>] => [
      key,
      [...new Set(toProviders(value))],
    ])
    .filter(([, providers]) => providers.length > 0);

  return Object.fromEntries(entries);
}
