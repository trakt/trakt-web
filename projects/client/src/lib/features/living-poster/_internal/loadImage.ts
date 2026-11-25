type LoadImageParams = {
  src: string;
  crossOrigin?: 'anonymous';
};

export async function loadImage({ src, crossOrigin }: LoadImageParams) {
  const image = new Image();
  if (crossOrigin) image.crossOrigin = crossOrigin;
  image.src = src;
  await image.decode();

  return image;
}
