import type { BrandingBackdrop } from '../../models/BrandingBackdrop.ts';
import type { LogoFormat } from '../../models/LogoFormat.ts';
import type { LogoSize } from '../../models/LogoSize.ts';

type ToLogoFilenameParams = {
  name: string;
  format: LogoFormat;
  size: LogoSize;
  backdrop?: BrandingBackdrop;
};

export function toLogoFilename({
  name,
  format,
  size,
  backdrop,
}: ToLogoFilenameParams) {
  const parts = [
    name,
    backdrop && backdrop !== 'light' ? backdrop : null,
    format === 'svg' ? null : size,
  ];

  return `${parts.filter(Boolean).join('-')}.${format}`;
}
