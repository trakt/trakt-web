import * as m from '$lib/features/i18n/messages.ts';

type SignedOutLabelParams = {
  mustWatchCount: number;
  optionalCount: number;
};

export function toLoreSignedOutLabel({
  mustWatchCount,
  optionalCount,
}: SignedOutLabelParams) {
  switch (mustWatchCount) {
    case 0:
      return m.text_movie_lore_progress_signed_out_none({
        optional: optionalCount,
      });
    case 1:
      return m.text_movie_lore_progress_signed_out_one({
        optional: optionalCount,
      });
    default:
      return m.text_movie_lore_progress_signed_out_other({
        count: mustWatchCount,
        optional: optionalCount,
      });
  }
}
