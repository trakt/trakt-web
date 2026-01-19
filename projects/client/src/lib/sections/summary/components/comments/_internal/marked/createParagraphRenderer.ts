import type { RendererThis, Tokens } from 'marked';

export function createParagraphRenderer(isCommentSpoiler: boolean) {
  return function (this: RendererThis, text: Tokens.Paragraph) {
    const parsedContent = this.parser.parseInline(text.tokens);

    if (isCommentSpoiler) {
      return `<p>${parsedContent}</p>`;
    }

    const hasSpoilers = text.tokens.some((t) => t.type === 'spoiler');
    const className = hasSpoilers ? ' class="trakt-spoiler"' : '';
    return `<p${className}>${parsedContent}</p>`;
  };
}
