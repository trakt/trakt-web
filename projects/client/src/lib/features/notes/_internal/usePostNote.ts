import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { NoteType } from '$lib/requests/models/NoteType.ts';
import { postNoteRequest } from '$lib/requests/queries/users/postNoteRequest.ts';

type PostNoteProps = {
  media: {
    type: MediaType;
    id: number;
  };
  notes: string;
  type: NoteType;
};

export function usePostNote() {
  const { track } = useTrack(AnalyticsEvent.AddNote);

  const post = useMutation(defineMutation({
    key: 'note:post',
    request: (body: PostNoteProps) => postNoteRequest({ body }),
    invalidations: (
      { variables },
    ) => [InvalidateAction.Note.Add(variables.media.type)],
  }));

  const postNote = async (props: PostNoteProps) => {
    const notes = props.notes.trim();
    if (!notes) {
      return;
    }

    track({ type: props.type });

    return await post.mutate({ ...props, notes });
  };

  return {
    postNote,
    isPosting: post.isPending,
  };
}
