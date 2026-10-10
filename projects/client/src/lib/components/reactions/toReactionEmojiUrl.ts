import { EMOJI_BASE_URL } from './constants.ts';

type EmojiAsset = 'emoji.svg' | '512.webp' | '512.gif';

export function toReactionEmojiUrl(code: string, asset: EmojiAsset) {
  return `${EMOJI_BASE_URL}/${code}/${asset}`;
}
