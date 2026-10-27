import type { SeasonRecap } from '../models/SeasonRecap.ts';

const CHAPTER_HEADING = /^##[ \t]+(.+)$/gm;

export function toRecapChapters(
  expanded: string | Nil,
): SeasonRecap['chapters'] {
  if (!expanded) {
    return [];
  }

  const headings = [...expanded.matchAll(CHAPTER_HEADING)];

  return headings.flatMap((heading, index) => {
    const bodyStart = heading.index + heading[0].length;
    const bodyEnd = headings.at(index + 1)?.index ?? expanded.length;
    const body = expanded.slice(bodyStart, bodyEnd).trim();

    if (!body) {
      return [];
    }

    return [
      {
        key: `recap-chapter-${index}`,
        title: heading[1]!.trim(),
        body,
      },
    ];
  });
}
