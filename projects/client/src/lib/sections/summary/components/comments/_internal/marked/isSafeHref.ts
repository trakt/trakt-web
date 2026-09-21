const NAMED_ENTITIES: Readonly<Record<string, string>> = {
  amp: '&',
  colon: ':',
  newline: '\n',
  num: '#',
  quest: '?',
  sol: '/',
  tab: '\t',
};

const ENTITY = /&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z]+));?/g;
const SCHEME_BOUNDARY = /[/?#]/;

const ALLOWED = new Set(['http', 'https', 'mailto']);

const MAX_CODE_POINT = 0x10ffff;
const LAST_IGNORED = 0x20;
const DELETE = 0x7f;

// Whitespace and control characters are dropped from a URL before it is
// parsed, so a tab inside `java\tscript:` does not stop it reaching the
// network as `javascript:`.
function withoutIgnored(href: string): string {
  return [...href]
    .filter((character) => {
      const code = character.codePointAt(0) ?? 0;
      return code > LAST_IGNORED && code !== DELETE;
    })
    .join('');
}

function fromCodePoint(codePoint: number): string | null {
  if (
    !Number.isFinite(codePoint) || codePoint < 0 || codePoint > MAX_CODE_POINT
  ) {
    return null;
  }

  return String.fromCodePoint(codePoint);
}

// A browser HTML-decodes the attribute before it parses the URL, so
// `java&#115;cript:` and `javascript&colon;` are both live schemes that a check
// against the literal href would wave through. One pass, like the browser.
function decodeEntities(href: string): string {
  return href.replace(ENTITY, (entity, decimal, hex, name) => {
    if (decimal !== undefined) return fromCodePoint(Number(decimal)) ?? entity;
    if (hex !== undefined) {
      return fromCodePoint(Number.parseInt(hex, 16)) ?? entity;
    }

    return NAMED_ENTITIES[name.toLowerCase()] ?? entity;
  });
}

/**
 * Whether an href is one a comment author may send a reader to.
 *
 * An allowlist rather than a blocklist: anything that resolves to a scheme
 * outside `http`, `https` and `mailto` is refused, as is anything whose scheme
 * position holds something that is not a scheme at all. A reference with no
 * scheme — relative, protocol-relative, a bare fragment or query — is safe.
 */
export function isSafeHref(href: string): boolean {
  const normalized = withoutIgnored(decodeEntities(href));
  const boundary = normalized.search(SCHEME_BOUNDARY);
  const head = boundary === -1 ? normalized : normalized.slice(0, boundary);
  const colon = head.indexOf(':');

  if (colon === -1) return true;

  return ALLOWED.has(head.slice(0, colon).toLowerCase());
}
