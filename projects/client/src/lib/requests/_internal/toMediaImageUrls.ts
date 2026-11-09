import { mayHaveImage } from './mayHaveImage.ts';

type ImageSize = 'thumb' | 'medium';

type ToMediaImageUrlsProps = {
  images: object | Nil;
  candidates: string[] | Nil;
  toUrl: (size: ImageSize) => HttpsUrl;
  mediumPlaceholder: HttpsUrl;
  thumbPlaceholder: HttpsUrl;
};

export function toMediaImageUrls({
  images,
  candidates,
  toUrl,
  mediumPlaceholder,
  thumbPlaceholder,
}: ToMediaImageUrlsProps) {
  if (!mayHaveImage(images, candidates)) {
    return { url: { medium: mediumPlaceholder, thumb: thumbPlaceholder } };
  }

  return { url: { medium: toUrl('medium'), thumb: toUrl('thumb') } };
}
