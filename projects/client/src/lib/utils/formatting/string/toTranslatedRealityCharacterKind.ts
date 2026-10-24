import * as m from '$lib/features/i18n/messages.ts';
import type { RealityCheckDetail } from '$lib/requests/models/RealityCheck.ts';

type CharacterKind = RealityCheckDetail['characters'][number]['kind'];

const CHARACTER_KIND_MAP: Record<CharacterKind, () => string> = {
  real: m.text_reality_kind_real,
  composite: m.text_reality_kind_composite,
  invented: m.text_reality_kind_invented,
};

export function toTranslatedRealityCharacterKind(kind: CharacterKind): string {
  return CHARACTER_KIND_MAP[kind]();
}
