import type { LivingPoster } from '../models/LivingPoster.ts';
import type { LivingPosterTarget } from '../models/LivingPosterTarget.ts';
import { decodeImage } from './decodeImage.ts';
import { fetchLivingPoster } from './fetchLivingPoster.ts';
import { fetchLivingPosterIndex } from './fetchLivingPosterIndex.ts';
import { hasLivingPoster } from './hasLivingPoster.ts';
import { resolveMaskSource } from './resolveMaskSource.ts';

async function withDecodedMasks(poster: LivingPoster): Promise<LivingPoster> {
  const masked = poster.effects.flatMap((effect) => {
    const src = resolveMaskSource({ effect, poster });
    return src === null ? [] : [{ effect, src }];
  });
  const sources = [...new Set(masked.map(({ src }) => src))];
  const decoded = await Promise.all(
    sources.map((src) =>
      decodeImage({ src, crossOrigin: 'anonymous' }).then(
        (ok) => [src, ok] as const,
      ),
    ),
  );
  const failed = new Set(decoded.filter(([, ok]) => !ok).map(([src]) => src));
  const dropped = new Set(
    masked.filter(({ src }) => failed.has(src)).map(({ effect }) => effect),
  );

  return dropped.size === 0
    ? poster
    : { ...poster, effects: poster.effects.filter((e) => !dropped.has(e)) };
}

export async function loadLivingPoster(
  target: LivingPosterTarget,
): Promise<LivingPoster | null> {
  const index = await fetchLivingPosterIndex();
  if (!index || !hasLivingPoster({ index, target })) return null;

  const poster = await fetchLivingPoster(target);
  if (!poster) return null;

  return withDecodedMasks(poster);
}
