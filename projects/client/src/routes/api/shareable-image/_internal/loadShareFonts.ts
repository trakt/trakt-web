import { error } from '$lib/utils/console/print.ts';
import type { R2Bucket } from '@cloudflare/workers-types';
import type { ImageResponseOptions } from '@ethercorps/sveltekit-og';

type ShareFonts = NonNullable<ImageResponseOptions['fonts']>;

type LoadShareFontsProps = {
  bucket: Pick<R2Bucket, 'get'> | Nil;
};

const FONT_FAMILY = 'Inter';

const FONT_SOURCES = [
  { path: 'assets/fonts/NotoSans-Regular.ttf', weight: 400 },
  { path: 'assets/fonts/NotoSans-Bold.ttf', weight: 700 },
] as const;

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
      FONT_SOURCES.map(async ({ path, weight }) => {
        const object = await bucket.get(path);

        if (!object) {
          throw new Error(`Missing font in R2: ${path}`);
        }

        return {
          name: FONT_FAMILY,
          data: await object.arrayBuffer(),
          weight,
          style: 'normal',
        } as const;
      }),
    );

    return cachedFonts;
  } catch (e) {
    error('Failed to load share fonts, falling back to the bundled set:', e);
    return;
  }
}
