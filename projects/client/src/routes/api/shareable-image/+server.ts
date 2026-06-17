import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import ShareCard from '$lib/features/share/ShareCard.svelte';
import { error } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import type { RequestHandler } from '@sveltejs/kit';
import { buildImagePath } from './_internal/buildImagePath.ts';
import { fetchMediaData } from './_internal/fetchMediaData.ts';
import { fetchPosterDataUri } from './_internal/fetchPosterDataUri.ts';
import { fetchWithUserAgent } from './_internal/fetchWithUserAgent.ts';

const cacheControl = 'public, max-age=604800';
const maxConcurrentImageRenders = 2;
const ogFontRegularUrl =
  'https://cdn-sveltekit-og.ethercorps.io/NotoSans-Regular.ttf';
const ogFontBoldUrl =
  'https://cdn-sveltekit-og.ethercorps.io/NotoSans-Bold.ttf';

type OgFont = {
  data: ArrayBuffer;
  name: string;
  weight: 400 | 700;
  style: 'normal';
};

let ogFontsPromise: Promise<Array<OgFont>> | null = null;

type InFlightImageGeneration = Promise<
  { buffer: ArrayBuffer; headers: Headers }
>;

type GlobalWithShareableImageInflight = typeof globalThis & {
  __shareableImageInflight?: Map<string, InFlightImageGeneration>;
};

const globalWithShareableImageInflight =
  globalThis as GlobalWithShareableImageInflight;
const inFlightImageGenerations =
  globalWithShareableImageInflight.__shareableImageInflight ??
    new Map<string, InFlightImageGeneration>();

globalWithShareableImageInflight.__shareableImageInflight =
  inFlightImageGenerations;

type GlobalWithShareableImageRenderQueue = typeof globalThis & {
  __shareableImageRenderQueue?: Array<() => void>;
  __shareableImageRenderActive?: number;
};

const globalWithShareableImageRenderQueue =
  globalThis as GlobalWithShareableImageRenderQueue;
const imageRenderQueue =
  globalWithShareableImageRenderQueue.__shareableImageRenderQueue ?? [];
let activeImageRenders =
  globalWithShareableImageRenderQueue.__shareableImageRenderActive ?? 0;

globalWithShareableImageRenderQueue.__shareableImageRenderQueue =
  imageRenderQueue;
globalWithShareableImageRenderQueue.__shareableImageRenderActive =
  activeImageRenders;

const logDebug = (message: string): void => {
  if (!IS_DEV) return;
  console.log(message);
};

const runWithImageRenderSlot = async <T>(
  task: () => Promise<T>,
): Promise<T> => {
  if (activeImageRenders >= maxConcurrentImageRenders) {
    await new Promise<void>((resolve) => {
      imageRenderQueue.push(resolve);
    });
  }

  activeImageRenders += 1;
  globalWithShareableImageRenderQueue.__shareableImageRenderActive =
    activeImageRenders;

  try {
    return await task();
  } finally {
    activeImageRenders -= 1;
    globalWithShareableImageRenderQueue.__shareableImageRenderActive =
      activeImageRenders;

    const next = imageRenderQueue.shift();
    if (next) {
      next();
    }
  }
};

const loadOgFonts = async (
  fetchFn: typeof fetch,
): Promise<Array<OgFont>> => {
  const [regularResponse, boldResponse] = await Promise.all([
    fetchFn(ogFontRegularUrl),
    fetchFn(ogFontBoldUrl),
  ]);

  if (!regularResponse.ok || !boldResponse.ok) {
    throw new Error('Failed to load OG fonts');
  }

  const [regularData, boldData] = await Promise.all([
    regularResponse.arrayBuffer(),
    boldResponse.arrayBuffer(),
  ]);

  return [
    {
      data: regularData,
      name: 'Inter',
      weight: 400,
      style: 'normal',
    },
    {
      data: boldData,
      name: 'Inter',
      weight: 700,
      style: 'normal',
    },
  ];
};

const getOgFonts = (fetchFn: typeof fetch): Promise<Array<OgFont>> => {
  if (ogFontsPromise) {
    return ogFontsPromise;
  }

  ogFontsPromise = loadOgFonts(fetchFn).catch((e) => {
    ogFontsPromise = null;
    throw e;
  });

  return ogFontsPromise;
};

// FIXME: add support for HMAC signed urls
export const GET: RequestHandler = async (
  { request, url, fetch, platform },
) => {
  const requestStartedAt = Date.now();
  const type = url.searchParams.get('type');
  const slug = url.searchParams.get('slug');
  const variant = url.searchParams.get('variant');

  if (!type || !slug || !variant) {
    return new Response('Missing parameters', { status: 400 });
  }

  if (type !== 'movie' && type !== 'show') {
    return new Response('Invalid type parameter', { status: 400 });
  }

  if (!/^[\w-]+$/.test(slug)) {
    return new Response('Invalid slug parameter', { status: 400 });
  }

  if (!(variant in SHARE_TYPE_DIMENSIONS)) {
    return new Response('Invalid variant parameter', { status: 400 });
  }

  if (!IS_DEV && !platform?.env?.R2_WALTER) {
    return new Response('Server configuration error', { status: 500 });
  }

  const shareType = variant as ShareType;
  const imagePath = buildImagePath({ shareType, slug, type });
  const requestKey = `${type}:${slug}:${shareType}`;

  logDebug(`[shareable-image] request start ${requestKey}`);

  if (!IS_DEV && platform) {
    const cachedImage = await platform.env.R2_WALTER.get(imagePath);
    if (cachedImage) {
      /*
        Cast needed due to structural mismatch between Cloudflare's ReadableStream
        and the DOM ReadableStream, they're the same at runtime.
      */
      return new Response(cachedImage.body as BodyInit, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': cacheControl,
        },
      });
    }
  }

  const existingGeneration = inFlightImageGenerations.get(imagePath);
  if (existingGeneration) {
    const waitStartedAt = Date.now();
    logDebug(`[shareable-image] join in-flight generation for ${requestKey}`);

    try {
      const result = await existingGeneration;
      logDebug(
        `[shareable-image] in-flight wait for ${requestKey}: ${
          Date.now() - waitStartedAt
        }ms`,
      );

      return new Response(result.buffer.slice(0), {
        headers: new Headers(result.headers),
      });
    } catch (e) {
      error('In-flight image generation failed:', e);
      return new Response('Failed to generate image', { status: 500 });
    }
  }

  const generationPromise = (async (): Promise<{
    buffer: ArrayBuffer;
    headers: Headers;
  }> => {
    logDebug(`[shareable-image] start generation ${requestKey}`);

    const fetchFn = fetchWithUserAgent({
      userAgent: request.headers.get('user-agent'),
      fetch,
    });

    const mediaFetchStartedAt = Date.now();
    const mediaData = await fetchMediaData({
      type,
      slug,
      fetch: fetchFn,
      requestKey,
      logDebug,
    }).catch(() => null);
    logDebug(
      `[shareable-image] media fetch ${
        Date.now() - mediaFetchStartedAt
      }ms ${requestKey}`,
    );

    if (!mediaData) {
      throw new Response('Data not found', { status: 404 });
    }

    const { media, ratings, crew } = mediaData;
    const posterUrl = media.poster.url.medium.replace(/\.webp$/i, '');

    const fontLoadStartedAt = Date.now();
    const posterFetchStartedAt = Date.now();
    const [ogFonts, posterDataUri] = await Promise.all([
      getOgFonts(fetchFn).then((fonts) => {
        logDebug(
          `[shareable-image] og fonts load ${
            Date.now() - fontLoadStartedAt
          }ms ${requestKey}`,
        );
        return fonts;
      }),
      fetchPosterDataUri({
        posterUrl,
        fetch: fetchFn,
      }).then((poster) => {
        logDebug(
          `[shareable-image] poster fetch ${
            Date.now() - posterFetchStartedAt
          }ms ${requestKey}`,
        );
        return poster;
      }),
    ]);

    const { width, height } = SHARE_TYPE_DIMENSIONS[shareType];
    const imageRenderQueueWaitStartedAt = Date.now();
    const { imageResponse, buffer } = await runWithImageRenderSlot(async () => {
      const queueWaitMs = Date.now() - imageRenderQueueWaitStartedAt;
      logDebug(
        `[shareable-image] image render queue wait ${queueWaitMs}ms ${requestKey}`,
      );

      const imageGenerationStartedAt = Date.now();
      const imageResponse = new ImageResponse(
        ShareCard,
        {
          width,
          height,
          fonts: [...ogFonts],
          debug: IS_DEV && url.searchParams.get('debug') === 'true',
        },
        {
          media,
          crew,
          ratings,
          posterUrl: posterDataUri,
          variant: shareType,
        },
      );

      const buffer = await imageResponse.arrayBuffer();
      logDebug(
        `[shareable-image] image generated in ${
          Date.now() - imageGenerationStartedAt
        }ms ${requestKey}`,
      );

      return { imageResponse, buffer };
    });

    logDebug(
      `[shareable-image] image render queue depth ${imageRenderQueue.length} ${requestKey}`,
    );

    if (!IS_DEV && platform) {
      try {
        await platform.env.R2_WALTER.put(imagePath, buffer, {
          httpMetadata: { contentType: 'image/png' },
          customMetadata: { cachedAt: String(Date.now()) },
        });
      } catch (e) {
        error('Failed to cache image in R2:', e);
      }
    }

    const responseHeaders = new Headers(imageResponse.headers);
    responseHeaders.set('Cache-Control', cacheControl);

    return { buffer, headers: responseHeaders };
  })();

  inFlightImageGenerations.set(imagePath, generationPromise);

  try {
    const result = await generationPromise;
    logDebug(
      `[shareable-image] total request ${
        Date.now() - requestStartedAt
      }ms ${requestKey}`,
    );
    return new Response(result.buffer, { headers: result.headers });
  } catch (e) {
    if (e instanceof Response) {
      return e;
    }

    error('ImageResponse error:', e);
    return new Response('Failed to generate image', { status: 500 });
  } finally {
    inFlightImageGenerations.delete(imagePath);
  }
};
