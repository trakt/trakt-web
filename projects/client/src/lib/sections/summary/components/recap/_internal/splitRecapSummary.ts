const sentenceSegmenter =
  typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'sentence' })
    : null;

function toSentences(paragraph: string, segmenter: Intl.Segmenter | null) {
  if (!segmenter) return [paragraph.trim()];

  return Array.from(segmenter.segment(paragraph), ({ segment }) =>
    segment.trim(),
  );
}

export function splitRecapSummary(
  summary: string,
  segmenter: Intl.Segmenter | null = sentenceSegmenter,
) {
  const paragraphs = summary.trim().split(/\n{2,}/);

  if (paragraphs.length > 1) {
    return {
      lead: paragraphs[0]!,
      rest: paragraphs.slice(1).join(' ').replaceAll('\n', ' '),
    };
  }

  const [lead = '', ...rest] = toSentences(paragraphs[0]!, segmenter);

  return { lead, rest: rest.join(' ') };
}
