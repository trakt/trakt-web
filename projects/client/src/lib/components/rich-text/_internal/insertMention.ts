import type { Editor } from '@tiptap/core';
import type { RichTextMention } from '../RichTextMention.ts';

type InsertMentionProps = {
  editor: Editor;
  mention: RichTextMention;
  range?: { from: number; to: number };
};

export function insertMention({ editor, mention, range }: InsertMentionProps) {
  const content = [
    {
      type: 'text',
      text: mention.name,
      marks: [{ type: 'link', attrs: { href: mention.href } }],
    },
    { type: 'text', text: ' ' },
  ];
  const chain = editor.chain().focus();

  return (range
    ? chain.insertContentAt(range, content)
    : chain.insertContent(content))
    .run();
}
