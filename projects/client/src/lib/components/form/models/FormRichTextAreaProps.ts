import type { Snippet } from 'svelte';
import type { RichTextMention } from '$lib/components/rich-text/RichTextMention.ts';
import type { FormInputProps } from './FormInputProps.ts';

export type FormRichTextAreaProps = FormInputProps & {
  actions?: Snippet;
  mentions?: ReadonlyArray<RichTextMention>;
  attachment?: Snippet;
};
