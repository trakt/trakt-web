const EDGE_BLANK_LINES = /^(?:\s|&nbsp;)+|(?:\s|&nbsp;)+$/g;

export function trimBlankLines(markdown: string): string {
  return markdown.replace(EDGE_BLANK_LINES, '');
}
