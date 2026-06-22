/**
 * Streaming service names sometimes carry a redundant channel/free suffix
 * (e.g. "MGM+ (on Amazon)", "Filmzie (free)", "Foo amazon channel") that just
 * duplicates the channel sub-logo. Strip it for display so the name reads
 * cleanly and the sub-brand is conveyed by the channel logo instead.
 *
 * Mirrors v2's streaming_links_helper name normalization.
 */
export function cleanStreamingServiceName(name: string): string {
  if (!name) {
    return '';
  }

  return name
    .replace(/\s*\(on\s+(amazon|roku|apple\s*tv)\)/i, '')
    .replace(/\s*\(free\)/i, '')
    .replace(
      /\s+(amazon\s+channel|roku\s+premium\s+channel|apple\s+tv\s+channel)/i,
      '',
    )
    .trim();
}
