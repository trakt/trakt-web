import type { ProfileShareData } from '$lib/features/share/models/ProfileShareData.ts';
import { toContentHash } from '../../_internal/toContentHash.ts';
import { versionedShareImagePrefix } from '../../_internal/versionedShareImagePrefix.ts';

type ToProfileImagePathProps = {
  slug: string;
  data: ProfileShareData;
};

export async function toProfileImagePath({
  slug,
  data,
}: ToProfileImagePathProps): Promise<string> {
  const { current } = versionedShareImagePrefix('profile');

  return `${current}og/${slug}/${await toContentHash(data)}.jpg`;
}
