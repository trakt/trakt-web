import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { NoteType } from '$lib/requests/models/NoteType.ts';
import { editNoteRequest } from '$lib/requests/queries/users/editNoteRequest.ts';

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
  const { track } = useTrack(AnalyticsEvent.EditNote);

  const edit = useMutation(defineMutation({
    key: 'note:edit',
    request: ({ id, notes, type }: EditNoteProps) =>
      editNoteRequest({ id, body: { type, notes } }),
    invalidations: (
      { variables },
    ) => [InvalidateAction.Note.Edit(variables.media.type)],
  }));

  const editNote = async ({ id, notes, media, type }: EditNoteProps) => {
    const trimmed = notes.trim();
    if (!trimmed) {
      return;
    }

    track({ type });

    return await edit.mutate({ id, notes: trimmed, media, type });
  };

  return {
    editNote,
    isEditing: edit.isPending,
  };
}
