import type { RendererThis, Tokens } from 'marked';

export function createHeadingRenderer() {
  return function (this: RendererThis, tokens: Tokens.Heading) {
    const parsedContent = this.parser.parseInline(tokens.tokens);
    return `<span class="bold trakt-comment-heading">${parsedContent}</span>`;
  };
}
