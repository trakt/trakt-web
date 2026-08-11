import { Marked, type MarkedExtension } from 'marked';
import { safeMarkdownExtension } from './_internal/safeMarkdownExtension.ts';

export function createSafeMarked(
  ...extensions: ReadonlyArray<MarkedExtension>
): Marked {
  return new Marked(...extensions, safeMarkdownExtension());
}
