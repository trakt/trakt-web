import type { ProfileShareData } from '$lib/features/share/models/ProfileShareData.ts';

const HASH_LENGTH = 12;

type ToProfileImagePathProps = {
  slug: string;
  data: ProfileShareData;
};

async function toContentHash(data: ProfileShareData) {
  const content = new TextEncoder().encode(JSON.stringify(data));
  const digest = await crypto.subtle.digest('SHA-256', content);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, HASH_LENGTH);
}

export async function toProfileImagePath({
  slug,
  data,
}: ToProfileImagePathProps): Promise<string> {
  return `images/share/profile/og/${slug}/${await toContentHash(data)}.jpg`;
}
