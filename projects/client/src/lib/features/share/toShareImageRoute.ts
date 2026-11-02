const MIR_IMAGE_PATTERN = /^\/users\/([\w-]+)\/mir\.jpg$/;

export function toShareImageRoute(pathname: string): string | undefined {
  const slug = MIR_IMAGE_PATTERN.exec(pathname)?.at(1);

  return slug ? `/api/shareable-image/mir/${slug}` : undefined;
}
