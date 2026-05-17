/**
 * Minimal XML entity escape/unescape for the five predefined entities.
 * R2's S3-compatible endpoint returns object keys XML-escaped and accepts
 * them escaped on multi-object delete requests — we have no full XML
 * parser, so we round-trip the five-entity set by hand.
 *
 * Order matters on unescape: `&amp;` must come last, otherwise a raw `&`
 * embedded in an already-decoded `&lt;` would be re-decoded.
 */

export function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function xmlUnescape(value: string): string {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}
