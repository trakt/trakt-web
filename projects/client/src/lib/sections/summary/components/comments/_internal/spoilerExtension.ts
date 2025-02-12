import type { TokenizerAndRendererExtension } from 'marked';

export function spoilerExtension(
  isCommentSpoiler: boolean,
): TokenizerAndRendererExtension {
  return {
    name: 'spoiler',
    level: 'inline',
    start(src: string) {
      return src.match(/\[spoiler\]/)?.index;
    },
    tokenizer(src) {
      const rule = /^\[spoiler\](.*?)\[\/spoiler\]/;
      const match = rule.exec(src);
      if (match) {
        const token = {
          type: 'spoiler',
          raw: match[0],
          text: match[1]?.trim() ?? '',
          tokens: [],
        };
        this.lexer.inline(token.text, token.tokens);
        return token;
      }

      return undefined;
    },
    renderer(token) {
      if (isCommentSpoiler) {
        // If the comment itself is already marked as a spoiler,
        // then parse the individual spoilers as a normal paragraph
        return `<p'>${token.text}</p>`;
      }

      return `<p class='trakt-spoiler'>${token.text}</p>`;
    },
  };
}
