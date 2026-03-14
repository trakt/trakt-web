import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';
import { resolve } from '$lib/utils/store/resolve.ts';
import { addNoteDrawerStore } from './_internal/addNoteDrawerStore.ts';
import { mapToNoteType } from './_internal/mapToNoteType.ts';
import type { NoteDrawerProps } from './models/NoteDrawerProps.ts';

// FIXME: extract generic util to check any limit
const isAtLimit = (limits: UserLimits, isVip: boolean) => {
  const limit = limits.totalNotes;
  const current = limit.current;

  return isVip ? current >= limit.vip : current >= limit.free;
};

export function useAddNoteDrawer() {
  const { notes, limits, user } = useUser();

  return {
    open: async (props: NoteDrawerProps) => {
      const currentUser = await resolve(user);
      const usageLimits = await resolve(limits);

      if (isAtLimit(usageLimits, currentUser.isVip)) {
        return;
      }

      const currentNotes = await resolve(notes);
      const mediaNotes = props.mediaType === 'movie'
        ? currentNotes.movies.get(props.id)
        : currentNotes.shows.get(props.id);

      // FIXME: remove this when notes are editable
      if (mediaNotes?.includes(mapToNoteType(props.type))) {
        return;
      }

      addNoteDrawerStore.open(props);
    },
  };
}
