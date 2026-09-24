import {
  SHARE_TYPE_DIMENSIONS,
  type ShareType,
} from '$lib/features/share/models/ShareType.ts';
import { fromHtml } from '@takumi-rs/helpers/html';
import type {
  FontDetails,
  ImageSource,
  OutputFormat,
  Renderer,
} from '@takumi-rs/wasm';
import { useShareRenderer } from './useShareRenderer.ts';

const QUALITY: Record<ShareType, number> = {
  'open-graph': 96,
  'feed': 92,
  'story': 92,
};

type RenderShareCardProps = {
  html: string;
  variant: ShareType;
  fonts: ReadonlyArray<FontDetails>;
  images: ImageSource[];
  debug?: boolean;
  format?: Extract<OutputFormat, 'jpeg' | 'raw'>;
};

const registeredFonts = new WeakMap<Renderer, Set<string>>();

function registerFonts(
  renderer: Renderer,
  fonts: ReadonlyArray<FontDetails>,
) {
  const registered = registeredFonts.get(renderer) ?? new Set<string>();
  registeredFonts.set(renderer, registered);

  fonts
    .map((font) => ({
      font,
      key: `${font.name}-${font.weight}-${font.style}`,
    }))
    .filter(({ key }) => !registered.has(key))
    .forEach(({ font, key }) => {
      renderer.registerFont(font);
      registered.add(key);
    });
}

export async function renderShareCard(
  { html, variant, fonts, images, debug = false, format = 'jpeg' }:
    RenderShareCardProps,
): Promise<Uint8Array<ArrayBuffer>> {
  const renderer = await useShareRenderer();
  const { width, height } = SHARE_TYPE_DIMENSIONS[variant];

  registerFonts(renderer, fonts);

  const { node, css } = fromHtml(html);

  return renderer.render(node, {
    width,
    height,
    ...(format === 'jpeg' ? { format, quality: QUALITY[variant] } : { format }),
    css,
    images,
    drawDebugBorder: debug,
  });
}
