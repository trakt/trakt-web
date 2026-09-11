const KLIPY_API = 'https://api.klipy.com/api/v1';

export function klipyUrl(path: string, params?: URLSearchParams): string {
  const query = params?.toString();

  return `${KLIPY_API}/${KLIPY_API_KEY}/${path}${query ? `?${query}` : ''}`;
}
