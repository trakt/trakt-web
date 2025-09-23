import type { TokenizerAndRendererExtension, Tokens } from 'marked';

export function matchSpoilerTagStart(src: string) {
  return src.match(/\[spoiler\]/)?.index;
}

export function matchSpoilerTag(src: string) {
  const rule = /^\[spoiler\](.*?)\[\/spoiler\]/;
  return rule.exec(src);
}

export function spoilerRenderer(
  text: string,
) {
  return `<span>${text}</span>`;
}

export function createParagraphSpoilerRenderer(isCommentSpoiler: boolean) {
  return function (text: Tokens.Paragraph) {
    if (isCommentSpoiler) {
      return `<p>${text.text}</p>`;
    }

    const build = text.tokens.reduce((acc, token) => {
      if (token.type === 'spoiler') {
        return acc + spoilerRenderer(token.text);
      }

      return acc + token.raw;
    }, '');

    const hasSpoilers = text.tokens.some((t) => t.type === 'spoiler');
    const className = hasSpoilers ? ' class="trakt-spoiler"' : '';
    return `<p${className}>${build}</p>`;
  };
}

export function spoilerExtension(): TokenizerAndRendererExtension {
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
      return spoilerRenderer(token.text);
    },
  };
}
