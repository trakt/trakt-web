import type { TokenizerAndRendererExtension } from 'marked';

export function matchSpoilerTagStart(src: string) {
  return src.match(/\[spoiler\]/)?.index;
}

export function matchSpoilerTag(src: string) {
  const rule = /^\[spoiler\](.*?)\[\/spoiler\]/s;
  return rule.exec(src);
}

export function spoilerRenderer(text: string) {
  return `<span>${text}</span>`;
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
      const parsedContent = this.parser.parseInline(token.tokens ?? []);
      return spoilerRenderer(parsedContent);
    },
  };
}
