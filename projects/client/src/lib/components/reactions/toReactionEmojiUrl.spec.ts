import { describe, expect, it } from 'vitest';
import { toReactionEmojiUrl } from './toReactionEmojiUrl.ts';

describe('util: toReactionEmojiUrl', () => {
  it('should build the noto emoji asset url for a code', () => {
    expect(toReactionEmojiUrl('1f631', 'emoji.svg')).toBe(
      'https://fonts.gstatic.com/s/e/notoemoji/latest/1f631/emoji.svg',
    );
  });
});
