import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import { unwrapGradientPatterns } from './unwrapGradientPatterns.ts';
import { useShareCodecs } from './useShareCodecs.ts';

const QUALITY: Record<ShareType, number> = {
  'open-graph': 96,
  'feed': 92,
  'story': 92,
};

type RasterizeShareCardProps = {
  svg: string;
  variant: ShareType;
};

export async function rasterizeShareCard(
  { svg, variant }: RasterizeShareCardProps,
): Promise<ArrayBuffer> {
  const { Resvg, encodeJpeg } = await useShareCodecs();
  const { width, height } = SHARE_TYPE_DIMENSIONS[variant];

  const rendered = new Resvg(unwrapGradientPatterns(svg), {
    fitTo: { mode: 'width', value: width },
  }).render();

  const image = {
    data: new Uint8ClampedArray(
      rendered.pixels.buffer,
      rendered.pixels.byteOffset,
      rendered.pixels.byteLength,
    ),
    width,
    height,
    colorSpace: 'srgb',
  } as ImageData;

  return encodeJpeg(image, {
    quality: QUALITY[variant],
    progressive: false,
    auto_subsample: false,
    chroma_subsample: 1,
  });
}
