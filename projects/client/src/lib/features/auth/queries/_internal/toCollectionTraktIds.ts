import type {
  CollectionMinimalResponse,
  CollectionMinimalShowResponse,
} from '@trakt/api';

export function toCollectionTraktIds(
  response: CollectionMinimalResponse | CollectionMinimalShowResponse | Nil,
): number[] {
  return Object.keys(response ?? {}).map((key) => parseInt(key, 10));
}
