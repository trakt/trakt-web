import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type DropNoteTarget = {
  title: string;
  type: MediaType;
  id: number;
};

export type DropNoteContext = {
  show: (target: DropNoteTarget) => void;
};
