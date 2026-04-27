import type { NoteType } from '$lib/requests/models/NoteType.ts';
import type { NoteDrawerType } from '../models/NoteDrawerProps.ts';

export function mapToNoteDrawerType(type: NoteType): NoteDrawerType {
  switch (type) {
    case 'favorites':
      return 'favorites';
    case 'note':
      return 'drop';
  }
}
