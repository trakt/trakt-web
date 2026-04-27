import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { NoteType } from '$lib/requests/models/NoteType.ts';
import { editNoteRequest } from '$lib/requests/queries/users/editNoteRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { BehaviorSubject } from 'rxjs';

type EditNoteProps = {
  id: number;
  notes: string;
  media: {
    type: MediaType;
    id: string | number;
  };
  type: NoteType;
};

export function useEditNote() {
  const isEditing = new BehaviorSubject(false);

  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.EditNote);

  const editNote = async ({ id, notes, media, type }: EditNoteProps) => {
    isEditing.next(true);

    const trimmed = notes.trim();
    if (!trimmed) {
      isEditing.next(false);
      return;
    }

    track({ type });
    const result = await editNoteRequest({
      id,
      body: { type, notes: trimmed },
    });
    await invalidate(InvalidateAction.Note.Edit(media.type));

    isEditing.next(false);
    return result;
  };

  return {
    editNote,
    isEditing: isEditing.asObservable(),
  };
}
