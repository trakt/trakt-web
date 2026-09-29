import type { YirPersonaId } from '$lib/requests/models/YirPersonaId.ts';
import type {
  YirHighlight,
  YirHighlightKind,
  YirPersonaResult,
} from '$lib/requests/models/YirPersonaResult.ts';
import type { PersonaCardData } from './PersonaCardData.ts';
import { personaCopy } from '../persona/personaCopy.ts';
import { toPersonaStat } from './toPersonaStat.ts';

function findValue(
  highlights: ReadonlyArray<YirHighlight>,
  kind: YirHighlightKind,
) {
  return highlights.find((highlight) => highlight.kind === kind)?.value ??
    null;
}

type ToPersonaCardDataProps = {
  result: YirPersonaResult;
  persona: YirPersonaId;
  highlights: ReadonlyArray<YirHighlight>;
};

export function toPersonaCardData(
  { result, persona, highlights }: ToPersonaCardDataProps,
): PersonaCardData {
  const copy = personaCopy(persona);

  return {
    persona,
    name: copy.name,
    tagline: copy.tagline,
    number: String(result.cardNumber).padStart(2, '0'),
    stats: highlights.map(toPersonaStat),
    rating: findValue(highlights, 'avg-rating'),
    share: findValue(highlights, 'top-show-share'),
    scores: result.scores,
  };
}
