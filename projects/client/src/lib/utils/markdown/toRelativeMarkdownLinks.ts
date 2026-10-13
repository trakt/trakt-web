export function toRelativeMarkdownLinks(text: string, origin: string): string {
  return text.replaceAll(`](${origin}/`, '](/');
}
