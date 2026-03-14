import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { NoteType } from '$lib/requests/models/NoteType.ts';
import { postNoteRequest } from '$lib/requests/queries/users/postNoteRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

type PostNoteProps = {
  media: {
    type: MediaType;
    id: number;
  };
  notes: string;
  type: NoteType;
};

export function usePostNote() {
  const isPosting = new BehaviorSubject(false);

  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.AddNote);

  const postNote = async (props: PostNoteProps) => {
    isPosting.next(true);

    const notes = props.notes.trim();
    if (!notes) {
      isPosting.next(false);
      return;
    }

    const payload = {
      ...props,
      notes,
    };

    track({ type: props.type });
    const result = await postNoteRequest({ body: payload });
    await invalidate(InvalidateAction.Note.Add(props.media.type));

    isPosting.next(false);
    return result;
  };

  return {
    postNote,
    isPosting: isPosting.asObservable(),
  };
}
