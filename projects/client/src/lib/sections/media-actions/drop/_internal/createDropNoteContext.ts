import { setContext } from 'svelte';
import type { DropNoteContext } from './DropNoteContext.ts';

const CONTEXT_KEY = 'drop-note-prompt';

export function createDropNoteContext(context: DropNoteContext) {
  setContext(CONTEXT_KEY, context);
}
