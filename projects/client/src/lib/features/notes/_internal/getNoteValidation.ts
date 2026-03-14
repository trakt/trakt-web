import * as m from '$lib/features/i18n/messages.ts';
import { NOTE_CHARACTER_LIMIT } from './constants/index.ts';

export function getNoteValidation(note: string) {
  const trimmed = (value: string) => value.trim();

  return {
    isValid: (value: string) =>
      trimmed(value).length > 0 &&
      trimmed(value).length <= NOTE_CHARACTER_LIMIT,
    errorText: trimmed(note).length >= NOTE_CHARACTER_LIMIT
      ? m.validation_text_note_character_limit({
        limit: NOTE_CHARACTER_LIMIT,
      })
      : m.validation_text_note(),
  };
}
