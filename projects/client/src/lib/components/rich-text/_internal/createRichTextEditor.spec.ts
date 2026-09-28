import type { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { createRichTextEditor } from './createRichTextEditor.ts';

let editor: Editor | null = null;

async function roundTrip(markdown: string) {
  editor = await createRichTextEditor({
    element: document.createElement('div'),
    markdown,
    placeholder: '',
    label: '',
    autofocus: false,
    onUpdate: () => {},
    onTransaction: () => {},
    onMentionChange: () => {},
    onMentionKeyDown: () => false,
  });

  return editor.getMarkdown();
}

describe('util: createRichTextEditor', () => {
  afterEach(() => editor?.destroy());

  it.each([
    ['plain text', 'Great movie'],
    ['bold and italic', 'It was **great** and *fun*'],
    ['spoiler', 'He is [spoiler]the killer[/spoiler]'],
    ['spoiler around bold', 'He is [spoiler]**the** killer[/spoiler]'],
    ['link', 'See [this](https://trakt.tv/movies/heretic-2024)'],
    ['bullet list', '- one\n- two'],
    ['quote', '> so good'],
    ['paragraphs', 'one\n\ntwo'],
    ['heading', '# Title'],
    ['ordered list', '1. one\n2. two'],
    ['strikethrough', '~~nope~~'],
    ['inline code', 'use `code` here'],
  ])('should keep %s intact', async (_name, markdown) => {
    expect(await roundTrip(markdown)).toBe(markdown);
  });

  it('should keep single line breaks', async () => {
    const result = await roundTrip('one\ntwo');

    expect(result.replace(/ +\n/, '\n')).toBe('one\ntwo');
  });

  it('should return an empty string for an empty document', async () => {
    expect(await roundTrip('')).toBe('');
  });
});
