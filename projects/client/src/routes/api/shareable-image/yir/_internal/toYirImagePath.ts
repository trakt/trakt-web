import type { ShareUser } from '$lib/features/share/models/ShareUser.ts';
import { toContentHash } from '../../_internal/toContentHash.ts';
import { versionedShareImagePrefix } from '../../_internal/versionedShareImagePrefix.ts';

type ToYirImagePathProps = {
  shape: string;
  slug: string;
  year: number;
  user: ShareUser;
};

export async function toYirImagePath({
  shape,
  slug,
  year,
  user,
}: ToYirImagePathProps): Promise<string> {
  const { current } = versionedShareImagePrefix('yir');

  return `${current}${shape}/${slug}/${year}/${await toContentHash(user)}.jpg`;
}
