import type { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { createRichTextEditor } from './createRichTextEditor.ts';
import { isolateCursorLine } from './isolateCursorLine.ts';

let editor: Editor | null = null;

async function createEditor() {
  editor = await createRichTextEditor({
    element: document.createElement('div'),
    markdown: '',
    placeholder: '',
    label: '',
    autofocus: false,
    onUpdate: () => {},
    onTransaction: () => {},
    onMentionChange: () => {},
    onMentionKeyDown: () => false,
  });

  return editor;
}

function toBlocks(created: Editor) {
  return (created.getJSON().content ?? []).map((block) => block.type);
}

describe('util: isolateCursorLine', () => {
  afterEach(() => editor?.destroy());

  it('should keep earlier lines out of a new bullet list', async () => {
    const created = await createEditor();
    created.commands.insertContent('hello');
    created.commands.keyboardShortcut('Shift-Enter');
    created.commands.insertContent('item');

    created.chain().focus().command(isolateCursorLine).toggleBulletList()
      .run();

    expect(toBlocks(created)).toEqual(['paragraph', 'bulletList', 'paragraph']);
    expect(created.getMarkdown()).toMatch(/^hello\n\n- item\n/);
  });

  it('should keep later lines out of a new quote', async () => {
    const created = await createEditor();
    created.commands.insertContent('quote');
    created.commands.keyboardShortcut('Shift-Enter');
    created.commands.insertContent('after');
    created.commands.setTextSelection(3);

    created.chain().focus().command(isolateCursorLine).toggleBlockquote()
      .run();

    expect(toBlocks(created)).toEqual(['blockquote', 'paragraph']);
  });

  it('should leave paragraphs without line breaks untouched', async () => {
    const created = await createEditor();
    created.commands.insertContent('hello');

    created.chain().focus().command(isolateCursorLine).toggleBulletList()
      .run();

    expect(toBlocks(created)).toEqual(['bulletList', 'paragraph']);
    expect(created.getMarkdown()).toMatch(/^- hello\n/);
  });
});
