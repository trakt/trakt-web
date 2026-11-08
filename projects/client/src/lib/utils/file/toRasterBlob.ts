import type { RasterFormat } from './RasterFormat.ts';
import { toRasterDimensions } from './toRasterDimensions.ts';
import { toRasterMime } from './toRasterMime.ts';

const QUALITY = 0.92;
const JPG_FALLBACK_BACKGROUND = '#ffffff';

type ToRasterBlobParams = {
  svg: Blob;
  format: RasterFormat;
  size: number;
  background?: string;
};

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error('Could not load the SVG as an image'));
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('Could not encode the image')),
      mime,
      QUALITY,
    );
  });
}

function withExplicitSize(svg: SVGSVGElement, width: number, height: number) {
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  return new XMLSerializer().serializeToString(svg);
}

export async function toRasterBlob({
  svg,
  format,
  size,
  background,
}: ToRasterBlobParams): Promise<Blob> {
  const document = new DOMParser().parseFromString(
    await svg.text(),
    'image/svg+xml',
  );
  const root = document.documentElement as unknown as SVGSVGElement;
  const viewBox = root.viewBox.baseVal;

  const { width, height } = toRasterDimensions({
    width: viewBox.width,
    height: viewBox.height,
    size,
  });

  const url = URL.createObjectURL(
    new Blob([withExplicitSize(root, width, height)], {
      type: 'image/svg+xml',
    }),
  );

  try {
    const image = await loadImage(url);
    const canvas = globalThis.document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is not available');

    const fill =
      background ?? (format === 'jpg' ? JPG_FALLBACK_BACKGROUND : undefined);
    if (fill) {
      context.fillStyle = fill;
      context.fillRect(0, 0, width, height);
    }

    context.drawImage(image, 0, 0, width, height);

    return await canvasToBlob(canvas, toRasterMime(format));
  } finally {
    URL.revokeObjectURL(url);
  }
}
