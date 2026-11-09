import { findDefined } from '$lib/utils/string/findDefined.ts';

export function mayHaveImage(
  images: object | Nil,
  candidates: string[] | Nil,
): boolean {
  return images == null || Boolean(findDefined(...(candidates ?? [])));
}
