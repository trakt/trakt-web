import { E2E_BASE_URL } from '../constants/constants.ts';

export function prefixPathWithBaseUrl(path: string) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = E2E_BASE_URL.endsWith('/')
    ? E2E_BASE_URL.slice(0, -1)
    : E2E_BASE_URL;

  return `${cleanBase}/${cleanPath}`;
}
