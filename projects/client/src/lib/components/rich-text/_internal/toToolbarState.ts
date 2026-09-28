import type { Editor } from '@tiptap/core';
import type { ToolbarState } from './ToolbarState.ts';

export function toToolbarState(editor: Editor): ToolbarState {
  return {
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    spoiler: editor.isActive('spoiler'),
    link: editor.isActive('link'),
    bulletList: editor.isActive('bulletList'),
    blockquote: editor.isActive('blockquote'),
  };
}
