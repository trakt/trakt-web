import type { BrandingBackdrop } from '../../models/BrandingBackdrop.ts';
import type { LogoFormat } from '../../models/LogoFormat.ts';
import type { LogoSize } from '../../models/LogoSize.ts';
import type { BrandingLogo } from './BrandingLogo.ts';
import { renderLogo } from './renderLogo.ts';
import { toLogoFilename } from './toLogoFilename.ts';

type RenderAllLogosParams = {
  section: HTMLElement;
  logos: ReadonlyArray<BrandingLogo>;
  backdrop: BrandingBackdrop;
  format: LogoFormat;
  size: LogoSize;
};

type RenderedLogo = {
  name: string;
  blob: Blob;
};

export function renderAllLogos({
  section,
  logos,
  backdrop,
  format,
  size,
}: RenderAllLogosParams): Promise<ReadonlyArray<RenderedLogo>> {
  return logos.reduce<Promise<ReadonlyArray<RenderedLogo>>>(
    async (previous, logo) => {
      const rendered = await previous;
      const element = section.querySelector<HTMLElement>(
        `[data-logo="${logo.key}"]`,
      );
      if (!element) return rendered;

      const blob = await renderLogo({
        element,
        format,
        size,
        backdrop: logo.fixedBackdrop ?? backdrop,
      });
      if (!blob) return rendered;

      const name = toLogoFilename({
        name: logo.name,
        format,
        size,
        backdrop: logo.fixedBackdrop ? undefined : backdrop,
      });

      return [...rendered, { name, blob }];
    },
    Promise.resolve([]),
  );
}
