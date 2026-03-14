import type { NoteType } from '$lib/requests/models/NoteType.ts';
import type { NoteDrawerType } from '../models/NoteDrawerProps.ts';

export function mapToNoteType(type: NoteDrawerType): NoteType {
  switch (type) {
    case 'favorites':
      return 'favorites';
    case 'drop':
      return 'note';
  }
}
