import type { RichTextMention } from '../RichTextMention.ts';

export type MentionListProps = {
  mentions: ReadonlyArray<RichTextMention>;
  onPick: (mention: RichTextMention) => void;
  activeIndex?: number;
};
