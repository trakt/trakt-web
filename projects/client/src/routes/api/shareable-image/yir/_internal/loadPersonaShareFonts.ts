import type { YirPersonaId } from '$lib/requests/models/YirPersonaId.ts';
import { error } from '$lib/utils/console/print.ts';
import type { R2Bucket } from '@cloudflare/workers-types';
import type { FontDetails } from '@takumi-rs/wasm';
import { personaShareFontFaces } from './personaShareFontFaces.ts';

type FontFace = ReturnType<typeof personaShareFontFaces>[number];

type LoadPersonaShareFontsProps = {
  persona: YirPersonaId;
  bucket: Pick<R2Bucket, 'get' | 'put'> | Nil;
  fetch: typeof globalThis.fetch;
};

type PersonaShareFonts = {
  fonts: FontDetails[];
  isComplete: boolean;
};

const FONT_PREFIX = 'assets/fonts/yir';
const GOOGLE_FONTS_CSS = 'https://fonts.googleapis.com/css2';
const TRUETYPE_USER_AGENT = 'Wget/1.0';
const FONT_URL = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/;

const cachedFaces = new Map<string, Promise<ArrayBuffer>>();

function toFontKey({ name, weight, style }: FontFace) {
  const family = name.toLowerCase().replaceAll(' ', '-');
  const italic = style === 'italic' ? '-italic' : '';

  return `${FONT_PREFIX}/${family}-${weight}${italic}.ttf`;
}

async function fetchFromGoogleFonts(
  { name, weight, style }: FontFace,
  fetch: typeof globalThis.fetch,
): Promise<ArrayBuffer> {
  const family = `${name.replaceAll(' ', '+')}:ital,wght@${style === 'italic' ? 1 : 0},${weight}`;
  const css = await fetch(`${GOOGLE_FONTS_CSS}?family=${family}`, {
    headers: { 'User-Agent': TRUETYPE_USER_AGENT },
  });
  const url = FONT_URL.exec(await css.text())?.at(1);

  if (!css.ok || !url) {
    throw new Error(`No font file for ${name} ${weight} ${style}`);
  }

  const font = await fetch(url);
  if (!font.ok) {
    throw new Error(`Failed to fetch font: ${url}`);
  }

  return font.arrayBuffer();
}

async function loadFace({
  face,
  bucket,
  fetch,
}: {
  face: FontFace;
  bucket: LoadPersonaShareFontsProps['bucket'];
  fetch: typeof globalThis.fetch;
}): Promise<ArrayBuffer> {
  const key = toFontKey(face);
  const stored = await bucket?.get(key);
  if (stored) return stored.arrayBuffer();

  const data = await fetchFromGoogleFonts(face, fetch);
  await bucket
    ?.put(key, data, { httpMetadata: { contentType: 'font/ttf' } })
    .catch((e: unknown) => error('Failed to store share font in R2:', e));

  return data;
}

function loadCachedFace(props: Parameters<typeof loadFace>[0]) {
  const key = toFontKey(props.face);
  const cached =
    cachedFaces.get(key) ??
    loadFace(props).catch((e: unknown) => {
      cachedFaces.delete(key);
      throw e;
    });
  cachedFaces.set(key, cached);

  return cached;
}

export async function loadPersonaShareFonts({
  persona,
  bucket,
  fetch,
}: LoadPersonaShareFontsProps): Promise<PersonaShareFonts> {
  const faces = await Promise.allSettled(
    personaShareFontFaces(persona).map(async (face) => ({
      name: face.name,
      weight: face.weight,
      style: face.style,
      data: await loadCachedFace({ face, bucket, fetch }),
    })),
  );

  const fonts = faces.flatMap((result) => {
    if (result.status === 'fulfilled') return [result.value];

    error('Failed to load persona share font:', result.reason);
    return [];
  });

  return { fonts, isComplete: fonts.length === faces.length };
}
