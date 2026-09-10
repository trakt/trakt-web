const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);
const LAST_CONTROL_CHARACTER_CODE = 0x20;
const PATH_SEPARATORS = /[/?]/u;
const AUTHORITY_SEPARATORS = /[/?#]/u;
const CHARACTER_REFERENCE_START = '&';

const stripControlCharacters = (url: string) =>
  Array.from(url)
    .filter((character) =>
      character.charCodeAt(0) > LAST_CONTROL_CHARACTER_CODE
    )
    .join('');

const hasEncodedScheme = (url: string) => {
  const authorityEnd = url.search(AUTHORITY_SEPARATORS);
  const authority = authorityEnd === -1 ? url : url.slice(0, authorityEnd);

  return authority.includes(CHARACTER_REFERENCE_START);
};

export function hasSafeUrlProtocol(url: string): boolean {
  const normalized = stripControlCharacters(url);

  if (normalized.startsWith('#')) return true;

  const colonIndex = normalized.indexOf(':');
  if (colonIndex === -1) return !hasEncodedScheme(normalized);

  const prefix = normalized.slice(0, colonIndex);
  if (PATH_SEPARATORS.test(prefix)) return true;

  return SAFE_PROTOCOLS.has(`${prefix.toLowerCase()}:`);
}
