import { hasSafeUrlProtocol } from '$lib/utils/url/hasSafeUrlProtocol.ts';
import type { Editor } from '@tiptap/core';
import type { MentionSuggestionState } from './MentionSuggestionState.ts';
import { stripPastedLinks } from './stripPastedLinks.ts';

export type CreateRichTextEditorProps = {
  element: HTMLElement;
  markdown: string;
  placeholder: string;
  label: string;
  describedBy?: string;
  autofocus: boolean;
  onUpdate: (editor: Editor) => void;
  onTransaction: (editor: Editor) => void;
  onMentionChange: (state: MentionSuggestionState | null) => void;
  onMentionKeyDown: (event: KeyboardEvent) => boolean;
};

export async function createRichTextEditor({
  element,
  markdown,
  placeholder,
  label,
  describedBy,
  autofocus,
  onUpdate,
  onTransaction,
  onMentionChange,
  onMentionKeyDown,
}: CreateRichTextEditorProps): Promise<Editor> {
  const [
    { Editor },
    { default: StarterKit },
    { Markdown },
    { Placeholder },
    { SpoilerMark },
    { MentionSuggestion },
  ] = await Promise.all([
    import('@tiptap/core'),
    import('@tiptap/starter-kit'),
    import('@tiptap/markdown'),
    import('@tiptap/extension-placeholder'),
    import('./SpoilerMark.ts'),
    import('./MentionSuggestion.ts'),
  ]);

  return new Editor({
    element,
    autofocus: autofocus ? 'end' : false,
    content: markdown,
    contentType: 'markdown',
    extensions: [
      StarterKit.configure({
        underline: false,
        link: {
          openOnClick: false,
          autolink: false,
          linkOnPaste: false,
          isAllowedUri: (url) => hasSafeUrlProtocol(url),
        },
      }),
      SpoilerMark,
      MentionSuggestion.configure({
        onChange: onMentionChange,
        onKeyDown: onMentionKeyDown,
      }),
      Placeholder.configure({ placeholder }),
      Markdown.configure({ markedOptions: { gfm: true, breaks: true } }),
    ],
    editorProps: {
      transformPastedHTML: stripPastedLinks,
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': label,
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
      },
    },
    onUpdate: ({ editor }) => onUpdate(editor),
    onTransaction: ({ editor }) => onTransaction(editor),
  });
}
