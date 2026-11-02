import type { ShareUser } from '$lib/features/share/models/ShareUser.ts';
import { toContentHash } from '../../_internal/toContentHash.ts';
import { versionedShareImagePrefix } from '../../_internal/versionedShareImagePrefix.ts';

type ToMirImagePathProps = {
  shape: string;
  slug: string;
  year: number;
  month: number;
  user: ShareUser;
};

export async function toMirImagePath({
  shape,
  slug,
  year,
  month,
  user,
}: ToMirImagePathProps): Promise<string> {
  const { current } = versionedShareImagePrefix('mir');

  return `${current}${shape}/${slug}/${year}-${month}/${await toContentHash(user)}.jpg`;
}
