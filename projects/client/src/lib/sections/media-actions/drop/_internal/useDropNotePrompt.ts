import { getContext } from 'svelte';
import type { DropNoteContext } from './DropNoteContext.ts';

const CONTEXT_KEY = 'drop-note-prompt';

export function useDropNotePrompt(): DropNoteContext | undefined {
  try {
    return getContext<DropNoteContext>(CONTEXT_KEY);
  } catch {
    return undefined;
  }
}
