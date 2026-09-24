import { error } from '$lib/utils/console/print.ts';
import type { R2Bucket } from '@cloudflare/workers-types';
import type { FontDetails } from '@takumi-rs/wasm';
import { shareFontSources } from './shareFontSources.ts';

type ShareFonts = FontDetails[];

type LoadShareFontsProps = {
  bucket: Pick<R2Bucket, 'get'> | Nil;
};

let cachedFonts: ShareFonts | undefined;

export async function loadShareFonts(
  { bucket }: LoadShareFontsProps,
): Promise<ShareFonts | undefined> {
  if (cachedFonts) {
    return cachedFonts;
  }

  if (!bucket) {
    return;
  }

  try {
    cachedFonts = await Promise.all(
      shareFontSources.map(async ({ name, path, weight }) => {
        const object = await bucket.get(path);

        if (!object) {
          throw new Error(`Missing font in R2: ${path}`);
        }

        return {
          name,
          data: await object.arrayBuffer(),
          weight,
          style: 'normal',
        };
      }),
    );

    return cachedFonts;
  } catch (e) {
    error('Failed to load share fonts, falling back to the media cdn:', e);
    return;
  }
}
