export function parseTierPreview(params: URLSearchParams): boolean {
  return params.get('tier') === 'free';
}
