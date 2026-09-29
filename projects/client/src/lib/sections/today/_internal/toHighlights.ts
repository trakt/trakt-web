import type { TodayPersonAction } from '../models/TodayPersonAction.ts';
import { isTitleRating } from './isTitleRating.ts';

type Highlights = Readonly<{
  comment: TodayPersonAction | null;
  rating: TodayPersonAction | null;
}>;

const isQuotable = ({ kind, comment }: TodayPersonAction) =>
  kind === 'comment' && Boolean(comment?.text) && !comment?.isSpoiler;

export function toHighlights(
  actions: ReadonlyArray<TodayPersonAction>,
): Highlights {
  return {
    comment: actions.find(isQuotable) ?? null,
    rating: actions.find(isTitleRating) ?? null,
  };
}
