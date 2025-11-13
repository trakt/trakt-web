import * as m from '$lib/features/i18n/messages.ts';

const POSITION_MAP = {
  acting: m.translated_value_position_acting,
  self: m.translated_value_position_self,
  narrator: m.translated_value_position_narrator,
  production: m.translated_value_position_production,
  art: m.translated_value_position_art,
  crew: m.translated_value_position_crew,
  costume___make_up: m.translated_value_position_costume___make_up,
  directing: m.translated_value_position_directing,
  writing: m.translated_value_position_writing,
  sound: m.translated_value_position_sound,
  camera: m.translated_value_position_camera,
  lighting: m.translated_value_position_lighting,
  visual_effects: m.translated_value_position_visual_effects,
  editing: m.translated_value_position_editing,
  creator: m.translated_value_position_creator,
  created_by: m.translated_value_position_created_by,
} as const;

export function toTranslatedPosition(
  position: string | (keyof typeof POSITION_MAP),
  data?: Record<string, unknown>,
): string {
  const translationFn = POSITION_MAP[position as keyof typeof POSITION_MAP];
  return translationFn?.(data) ?? position;
}
