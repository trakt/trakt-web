import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import { error } from '$lib/utils/console/print.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import type { RequestEvent } from '@sveltejs/kit';
import type { ImageSource } from '@takumi-rs/wasm';
import { createServerTiming } from './createServerTiming.ts';
import { fetchWithoutAuthorization } from './fetchWithoutAuthorization.ts';
import { fetchWithUserAgent } from './fetchWithUserAgent.ts';
import { loadFallbackShareFonts } from './loadFallbackShareFonts.ts';
import { loadShareFonts } from './loadShareFonts.ts';
import { renderShareCard } from './renderShareCard.ts';

type ServerTiming = ReturnType<typeof createServerTiming>;

type ShareCardInput = {
  html: string;
  images: ImageSource[];
  isComplete?: boolean;
};

export type ShareStepProps<T> = {
  data: T;
  timing: ServerTiming;
};

type RespondWithShareImageProps<T> = {
  event: Pick<RequestEvent, 'request' | 'url' | 'fetch' | 'platform'>;
  shareType: ShareType;
  /**
   * R2 key for the rendered image, or null to skip the bucket cache. A
   * resolver keys the image on its data, at the cost of loading it first.
   */
  imagePath: string | null | ((data: T) => Promise<string>);
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

  const readCachedImage = async (path: string) => {
    if (!bucket) return null;

    const cachedImage = await timing.measure('cache', () => bucket.get(path));
    if (!cachedImage) return null;

    /*
      Cast needed due to structural mismatch between Cloudflare's ReadableStream
      and the DOM ReadableStream, they're the same at runtime.
    */
    return new Response(cachedImage.body as unknown as BodyInit, {
      headers: responseHeaders(),
    });
  };

  const cachedByPath =
    typeof imagePath === 'string' ? await readCachedImage(imagePath) : null;
  if (cachedByPath) return cachedByPath;

  const fontsRequest = timing.measure(
    'fonts',
    async () =>
      (await loadShareFonts({ bucket: platform?.env?.R2_WALTER })) ??
      (await loadFallbackShareFonts(globalThis.fetch).catch((e: unknown) => {
        error('Failed to load fallback share fonts:', e);
        return [];
      })),
  );
  fontsRequest.catch(NOOP_FN);

  const data = await timing.measure('data', () =>
    loadData({
      fetch: fetchWithoutAuthorization(
        fetchWithUserAgent({
          userAgent: request.headers.get('user-agent'),
          fetch,
        }),
      ),
      timing,
    }).catch(() => null),
  );

  if (!data) {
    return new Response('Data not found', { status: 404 });
  }

  const resolvedPath =
    typeof imagePath === 'function' ? await imagePath(data) : imagePath;

  const cachedByData =
    typeof imagePath === 'function' && resolvedPath
      ? await readCachedImage(resolvedPath)
      : null;
  if (cachedByData) return cachedByData;

  const fonts = await fontsRequest;

  const toBuffer = async ({
    html,
    images,
    isComplete = true,
  }: ShareCardInput) => ({
    buffer: await renderShareCard({
      html,
      variant: shareType,
      fonts,
      images,
      debug: IS_DEV && url.searchParams.get('debug') === 'true',
    }),
    isComplete,
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
    const { buffer, isComplete } = await renderWithFallback();

    if (bucket && resolvedPath && isComplete) {
      const cached = bucket
        .put(resolvedPath, buffer, {
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
