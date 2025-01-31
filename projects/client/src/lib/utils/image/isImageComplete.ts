export function isImageComplete(src: string): boolean {
  const image = new Image();
  image.src = src;

  return image.complete;
}
