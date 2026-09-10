import { escapeHtml } from '$lib/utils/string/escapeHtml.ts';
import { hasSafeUrlProtocol } from '$lib/utils/url/hasSafeUrlProtocol.ts';
import type { MarkedExtension, RendererThis, Tokens } from 'marked';

const DOUBLE_ENCODED_PERCENT = /%25/gu;

const toAttributeUrl = (url: string) => {
  if (!hasSafeUrlProtocol(url)) return null;

  try {
    return escapeHtml(encodeURI(url).replace(DOUBLE_ENCODED_PERCENT, '%'));
  } catch {
    return null;
  }
};

const toTitleAttribute = (title: string | Nil) =>
  title ? ` title="${escapeHtml(title)}"` : '';

export function safeMarkdownExtension(): MarkedExtension {
  return {
    renderer: {
      html({ text }: Tokens.HTML | Tokens.Tag) {
        return escapeHtml(text);
      },
      link(this: RendererThis, token: Tokens.Link) {
        const content = this.parser.parseInline(token.tokens);
        const href = toAttributeUrl(token.href);

        if (!href) return content;

        return `<a href="${href}"${
          toTitleAttribute(token.title)
        }>${content}</a>`;
      },
      image(token: Tokens.Image) {
        const alt = escapeHtml(token.text);
        const src = toAttributeUrl(token.href);

        if (!src) return alt;

        return `<img src="${src}" alt="${alt}"${
          toTitleAttribute(token.title)
        }>`;
      },
      text(token: Tokens.Text | Tokens.Escape) {
        if ('escaped' in token && token.escaped) return escapeHtml(token.text);

        return false;
      },
    },
  };
}
