import type { RasterFormat } from './RasterFormat.ts';

const MIME_BY_FORMAT: Record<RasterFormat, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
};

export function toRasterMime(format: RasterFormat): string {
  return MIME_BY_FORMAT[format];
}
