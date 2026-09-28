import type { RichTextMention } from './RichTextMention.ts';

export type RichTextEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
  placeholder: string;
  label: string;
  disabled?: boolean;
  autofocus?: boolean;
  mentions?: ReadonlyArray<RichTextMention>;
};
