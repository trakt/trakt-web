import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type NoteDrawerType = 'drop' | 'favorites';

export type NoteDrawerProps = {
  type: NoteDrawerType;
  title: string;
  id: number;
  mediaType: MediaType;
};
