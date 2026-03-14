import { BehaviorSubject } from 'rxjs';
import type { NoteDrawerProps } from '../models/NoteDrawerProps.ts';

type AddNoteDrawerState = NoteDrawerProps | null;

function createAddNoteDrawerStore() {
  const subject = new BehaviorSubject<AddNoteDrawerState>(null);

  return {
    subscribe: subject.subscribe.bind(subject),
    open: (options: NoteDrawerProps) => subject.next(options),
    close: () => subject.next(null),
  };
}

export const addNoteDrawerStore = createAddNoteDrawerStore();
