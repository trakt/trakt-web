import BoldIcon from '$lib/components/icons/BoldIcon.svelte';
import BulletListIcon from '$lib/components/icons/BulletListIcon.svelte';
import HideIcon from '$lib/components/icons/HideIcon.svelte';
import ItalicIcon from '$lib/components/icons/ItalicIcon.svelte';
import QuoteIcon from '$lib/components/icons/QuoteIcon.svelte';
import * as m from '$lib/features/i18n/messages.ts';
import { isolateCursorLine } from './isolateCursorLine.ts';
import type { ToolbarAction } from './ToolbarAction.ts';

export function toolbarActions(): ReadonlyArray<ToolbarAction> {
  return [
    {
      key: 'bold',
      label: m.button_label_format_bold(),
      icon: BoldIcon,
      run: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      key: 'italic',
      label: m.button_label_format_italic(),
      icon: ItalicIcon,
      run: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      key: 'spoiler',
      label: m.button_label_format_spoiler(),
      icon: HideIcon,
      run: (editor) => editor.chain().focus().toggleSpoiler().run(),
    },
    {
      key: 'bulletList',
      label: m.button_label_format_bullet_list(),
      icon: BulletListIcon,
      run: (editor) =>
        editor.chain().focus().command(isolateCursorLine).toggleBulletList()
          .run(),
    },
    {
      key: 'blockquote',
      label: m.button_label_format_quote(),
      icon: QuoteIcon,
      run: (editor) =>
        editor.chain().focus().command(isolateCursorLine).toggleBlockquote()
          .run(),
    },
  ];
}
