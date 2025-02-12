import type { TokenizerAndRendererExtension } from 'marked';

export function matchSpoilerTagStart(src: string) {
  return src.match(/\[spoiler\]/)?.index;
}

export function matchSpoilerTag(src: string) {
  const rule = /^\[spoiler\](.*?)\[\/spoiler\]/;
  return rule.exec(src);
}

export function spoilerRenderer(
  text: string,
  isCommentSpoiler: boolean,
) {
  if (isCommentSpoiler) {
    // If the comment itself is already marked as a spoiler,
    // then parse the individual spoilers as a normal paragraph
    return `<p>${text}</p>`;
  }

  return `<p class='trakt-spoiler'>${text}</p>`;
}

export function spoilerExtension(
  isCommentSpoiler: boolean,
): TokenizerAndRendererExtension {
  return {
    name: 'spoiler',
    level: 'inline',
    start(src: string) {
      return matchSpoilerTagStart(src);
    },
    tokenizer(src) {
      const match = matchSpoilerTag(src);
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
      return spoilerRenderer(token.text, isCommentSpoiler);
    },
  };
}
