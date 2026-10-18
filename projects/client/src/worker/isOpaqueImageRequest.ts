import { Domain } from './Domain.ts';

export function isOpaqueImageRequest(request: {
  url: string;
  mode: RequestMode;
}): boolean {
  const { hostname } = new URL(request.url);

  return Domain.images.includes(hostname) && request.mode === 'no-cors';
}
