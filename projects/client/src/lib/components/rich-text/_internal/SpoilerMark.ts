import { Mark } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    spoiler: {
      toggleSpoiler: () => ReturnType;
    };
  }
}

const SPOILER_TAG = /^\[spoiler\]([\s\S]*?)\[\/spoiler\]/;

export const SpoilerMark = Mark.create({
  name: 'spoiler',

  parseHTML() {
    return [{ tag: 'span[data-spoiler]' }];
  },

  renderHTML() {
    return ['span', { 'data-spoiler': '' }, 0];
  },

  markdownTokenName: 'spoiler',

  markdownTokenizer: {
    name: 'spoiler',
    level: 'inline',
    start: (src) => src.indexOf('[spoiler]'),
    tokenize(src, _tokens, lexer) {
      const match = SPOILER_TAG.exec(src);
      if (!match) return undefined;

      const text = match[1] ?? '';

      return {
        type: 'spoiler',
        raw: match[0],
        text,
        tokens: lexer.inlineTokens(text),
      };
    },
  },

  parseMarkdown: (token, helpers) =>
    helpers.applyMark('spoiler', helpers.parseInline(token.tokens ?? [])),

  renderMarkdown: (node, helpers) =>
    `[spoiler]${helpers.renderChildren(node)}[/spoiler]`,

  addCommands() {
    return {
      toggleSpoiler: () => ({ commands }) => commands.toggleMark(this.name),
    };
  },
});
