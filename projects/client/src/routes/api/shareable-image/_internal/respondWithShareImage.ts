import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import { error } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import type { RequestEvent } from '@sveltejs/kit';
import type { ImageSource } from '@takumi-rs/wasm';
import { createServerTiming } from './createServerTiming.ts';
import { fetchWithUserAgent } from './fetchWithUserAgent.ts';
import { loadFallbackShareFonts } from './loadFallbackShareFonts.ts';
import { loadShareFonts } from './loadShareFonts.ts';
import { renderShareCard } from './renderShareCard.ts';

type ServerTiming = ReturnType<typeof createServerTiming>;

type ShareCardInput = {
  html: string;
  images: ImageSource[];
};

export type ShareStepProps<T> = {
  data: T;
  timing: ServerTiming;
};

type RespondWithShareImageProps<T> = {
  event: Pick<RequestEvent, 'request' | 'url' | 'fetch' | 'platform'>;
  shareType: ShareType;
  /** R2 key for the rendered image, or null to skip the bucket cache. */
  imagePath: string | null;
  cacheControl: string;
  loadData: (props: {
    fetch: typeof globalThis.fetch;
    timing: ServerTiming;
  }) => Promise<T | null>;
  prepare: (props: ShareStepProps<T>) => Promise<ShareCardInput>;
  prepareFallback?: (props: ShareStepProps<T>) => Promise<ShareCardInput>;
  buildMetadata?: (data: T) => Record<string, string>;
};

export async function respondWithShareImage<T>({
  event,
  shareType,
  imagePath,
  cacheControl,
  loadData,
  prepare,
  prepareFallback,
  buildMetadata,
}: RespondWithShareImageProps<T>): Promise<Response> {
  const { request, url, fetch, platform } = event;

  if (!IS_DEV && !platform?.env?.R2_WALTER) {
    return new Response('Server configuration error', { status: 500 });
  }

  const imageHeaders = {
    'Content-Type': 'image/jpeg',
    'Cache-Control': cacheControl,
  };

  const timing = createServerTiming();
  const isTimed = url.searchParams.get('timing') === 'true';
  const responseHeaders = () =>
    isTimed
      ? { ...imageHeaders, 'Server-Timing': timing.toHeader() }
      : imageHeaders;

  const bucket = !IS_DEV && imagePath ? platform?.env?.R2_WALTER : null;

  if (bucket && imagePath) {
    const cachedImage = await timing.measure('cache', () =>
      bucket.get(imagePath),
    );
    if (cachedImage) {
      /*
        Cast needed due to structural mismatch between Cloudflare's ReadableStream
        and the DOM ReadableStream, they're the same at runtime.
      */
      return new Response(cachedImage.body as unknown as BodyInit, {
        headers: responseHeaders(),
      });
    }
  }

  const fontsRequest = timing.measure(
    'fonts',
    async () =>
      (await loadShareFonts({ bucket: platform?.env?.R2_WALTER })) ??
      (await loadFallbackShareFonts(globalThis.fetch).catch((e: unknown) => {
        error('Failed to load fallback share fonts:', e);
        return [];
      })),
  );

  const dataRequest = timing.measure('data', () =>
    loadData({
      fetch: fetchWithUserAgent({
        userAgent: request.headers.get('user-agent'),
        fetch,
      }),
      timing,
    }).catch(() => null),
  );

  const [data, fonts] = await Promise.all([dataRequest, fontsRequest]);

  if (!data) {
    return new Response('Data not found', { status: 404 });
  }

  const toBuffer = async ({ html, images }: ShareCardInput) =>
    renderShareCard({
      html,
      variant: shareType,
      fonts,
      images,
      debug: IS_DEV && url.searchParams.get('debug') === 'true',
    });

  const renderWithFallback = () =>
    prepare({ data, timing })
      .then(toBuffer)
      .catch((e: unknown) => {
        if (!prepareFallback) {
          throw e;
        }

        error('Failed to render the share card, using the fallback:', e);
        return prepareFallback({ data, timing }).then(toBuffer);
      });

  try {
    const buffer = await renderWithFallback();

    if (bucket && imagePath) {
      const cached = bucket
        .put(imagePath, buffer, {
          httpMetadata: { contentType: 'image/jpeg' },
          customMetadata: buildMetadata?.(data) ?? {
            cachedAt: new Date().toISOString(),
          },
        })
        .catch((e: unknown) => error('Failed to cache image in R2:', e));

      if (platform?.context) {
        platform.context.waitUntil(cached);
      } else {
        await cached;
      }
    }

    return new Response(buffer, { headers: responseHeaders() });
  } catch (e) {
    error('ImageResponse error:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
