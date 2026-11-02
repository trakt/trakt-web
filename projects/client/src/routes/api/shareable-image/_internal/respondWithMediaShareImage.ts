import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import ShareCard from '$lib/features/share/ShareCard.svelte';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import type { RequestEvent } from '@sveltejs/kit';
import { render } from 'svelte/server';
import { buildImageMetadata } from './buildImageMetadata.ts';
import { buildImagePath } from './buildImagePath.ts';
import { fetchMediaData } from './fetchMediaData.ts';
import { loadPosterImages } from './loadPosterImages.ts';
import { resolvePosterSource } from './resolvePosterSource.ts';
import {
  respondWithShareImage,
  type ShareStepProps,
} from './respondWithShareImage.ts';
import { warmPoster } from './warmPoster.ts';

type RespondWithMediaShareImageProps = {
  event: Pick<RequestEvent, 'request' | 'url' | 'fetch' | 'platform'>;
  type: MediaType;
  slug: string;
  shareType: ShareType;
  cacheControl: string;
};

type MediaData = Awaited<ReturnType<typeof fetchMediaData>>;

export function respondWithMediaShareImage({
  event,
  type,
  slug,
  shareType,
  cacheControl,
}: RespondWithMediaShareImageProps): Promise<Response> {
  const prepareWithPoster =
    (toPosterUrl: (data: MediaData) => string) =>
    async ({ data, timing }: ShareStepProps<MediaData>) => {
      const posterUrl = toPosterUrl(data);
      const images = await timing.measure('images', () =>
        loadPosterImages({ posterUrl, fetch: globalThis.fetch }),
      );
      const { body, head } = render(ShareCard, {
        props: { ...data, posterUrl, variant: shareType },
      });

      return { html: body + head, images };
    };

  return respondWithShareImage({
    event,
    shareType,
    imagePath: buildImagePath({ shareType, slug, type }),
    cacheControl,
    loadData: ({ fetch, timing }) =>
      fetchMediaData({
        type,
        slug,
        fetch,
        onSummary: (media) =>
          timing.measure('poster', () =>
            warmPoster({
              posterUrl: resolvePosterSource(media.poster.url.medium),
              fetch: globalThis.fetch,
            }),
          ),
      }),
    prepare: prepareWithPoster(({ media }) =>
      resolvePosterSource(media.poster.url.medium),
    ),
    prepareFallback: prepareWithPoster(() =>
      resolvePosterSource(MEDIA_POSTER_PLACEHOLDER),
    ),
    buildMetadata: ({ media }) =>
      buildImageMetadata({ media, cachedAt: new Date() }),
  });
}
