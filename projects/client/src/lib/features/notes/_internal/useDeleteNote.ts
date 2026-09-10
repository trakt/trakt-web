import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { NoteType } from '$lib/requests/models/NoteType.ts';
import { deleteNoteRequest } from '$lib/requests/queries/users/deleteNoteRequest.ts';

type DeleteNoteProps = {
  id: number;
  media: {
    type: MediaType;
    id: string | number;
  };
  type: NoteType;
};

export function useDeleteNote() {
  const { track } = useTrack(AnalyticsEvent.DeleteNote);

  const deletion = useMutation(defineMutation({
    key: 'note:delete',
    request: ({ id, type }: DeleteNoteProps) =>
      deleteNoteRequest({ id, body: { type } }),
    invalidations: (
      { variables },
    ) => [InvalidateAction.Note.Delete(variables.media.type)],
  }));

  const deleteNote = async ({ id, media, type }: DeleteNoteProps) => {
    track({ type });

    await deletion.mutate({ id, media, type });
  };

  return {
    deleteNote,
    isDeleting: deletion.isPending,
  };
}
