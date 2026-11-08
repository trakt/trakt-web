import { toRasterBlob } from '$lib/utils/file/toRasterBlob.ts';
import { toSvgBlob } from '$lib/utils/file/toSvgBlob.ts';
import type { BrandingBackdrop } from '../../models/BrandingBackdrop.ts';
import type { LogoFormat } from '../../models/LogoFormat.ts';
import type { LogoSize } from '../../models/LogoSize.ts';
import { toLogoBackground } from './toLogoBackground.ts';

type RenderLogoParams = {
  element: HTMLElement;
  format: LogoFormat;
  size: LogoSize;
  backdrop: BrandingBackdrop;
};

export function renderLogo({
  element,
  format,
  size,
  backdrop,
}: RenderLogoParams): Promise<Blob | null> {
  const svg = toSvgBlob(element);
  if (!svg) return Promise.resolve(null);
  if (format === 'svg') return Promise.resolve(svg);

  return toRasterBlob({
    svg,
    format,
    size,
    background: format === 'jpg' ? toLogoBackground(backdrop) : undefined,
  });
}
