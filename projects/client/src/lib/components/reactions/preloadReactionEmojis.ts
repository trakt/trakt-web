import { toReactionEmojiUrl } from './toReactionEmojiUrl.ts';

const preloaded = new Set<string>();

export function preloadReactionEmojis(codes: ReadonlyArray<string>) {
  codes
    .filter((code) => !preloaded.has(code))
    .forEach((code) => {
      preloaded.add(code);

      const image = new Image();
      image.fetchPriority = 'low';
      image.src = toReactionEmojiUrl(code, 'emoji.svg');
    });
}
