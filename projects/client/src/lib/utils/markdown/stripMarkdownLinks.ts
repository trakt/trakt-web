const MARKDOWN_LINK = /\[([^\]\n]+)\]\([^)\s]+\)/g;

export function stripMarkdownLinks(text: string): string {
  return text.replace(MARKDOWN_LINK, '$1');
}
