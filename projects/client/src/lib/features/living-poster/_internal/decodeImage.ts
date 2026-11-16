type DecodeImageParams = {
  src: string;
  crossOrigin?: 'anonymous';
};

export async function decodeImage({ src, crossOrigin }: DecodeImageParams) {
  const image = new Image();
  if (crossOrigin) image.crossOrigin = crossOrigin;
  image.src = src;

  try {
    await image.decode();
    return image.naturalWidth > 0;
  } catch {
    return false;
  }
}
