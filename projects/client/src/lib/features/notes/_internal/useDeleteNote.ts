import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { NoteType } from '$lib/requests/models/NoteType.ts';
import { deleteNoteRequest } from '$lib/requests/queries/users/deleteNoteRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

type UseDeleteNoteProps = {
  id: number;
  media: {
    type: MediaType;
    id: string | number;
  };
  type: NoteType;
};

export function useDeleteNote({ id, media, type }: UseDeleteNoteProps) {
  const isDeleting = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.DeleteNote);

  const deleteNote = async () => {
    isDeleting.next(true);

    track({ type });
    await deleteNoteRequest({ id, body: { type } });
    await invalidate(InvalidateAction.Note.Delete(media.type));

    isDeleting.next(false);
  };

  return {
    deleteNote,
    isDeleting: isDeleting.asObservable(),
  };
}
