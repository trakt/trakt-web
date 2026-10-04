import type { Editor } from '@tiptap/core';
import type { Snippet } from 'svelte';
import type { RichTextMention } from '../RichTextMention.ts';
import type { ToolbarState } from './ToolbarState.ts';

export type RichTextToolbarProps = {
  editor: Editor | null;
  toolbarState: ToolbarState;
  disabled: boolean;
  mentions: ReadonlyArray<RichTextMention>;
  actions?: Snippet;
};
