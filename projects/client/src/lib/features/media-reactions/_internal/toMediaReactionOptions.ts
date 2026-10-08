import { toReactionPickerOptions } from '$lib/components/reactions/toReactionPickerOptions.ts';
import { QUICK_MEDIA_REACTIONS } from '$lib/features/media-reactions/constants.ts';
import { MediaReactionSchema } from '$lib/requests/models/MediaReaction.ts';

export function toMediaReactionOptions() {
  return toReactionPickerOptions([
    ...QUICK_MEDIA_REACTIONS,
    ...MediaReactionSchema.options.filter(
      (reaction) => !QUICK_MEDIA_REACTIONS.includes(reaction),
    ),
  ]);
}
