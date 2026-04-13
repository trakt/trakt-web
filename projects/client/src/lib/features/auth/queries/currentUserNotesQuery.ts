import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import {
  type NoteType,
  NoteTypeSchema,
} from '$lib/requests/models/NoteType.ts';
import type { UserNoteMinimalResponse } from '$lib/requests/models/UserNoteMinimalResponse.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';

export const UserNotesHistorySchema = z.object({
  movies: z.map(z.number(), NoteTypeSchema.array()),
  shows: z.map(z.number(), NoteTypeSchema.array()),
});

export type UserNotesHistory = z.infer<typeof UserNotesHistorySchema>;

const currentUserNotesRequest = async ({ fetch }: ApiParams) => {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/notes/minimal',
  });

  return response.ok
    ? { body: await response.json() as UserNoteMinimalResponse[], status: 200 }
    : { body: [] as UserNoteMinimalResponse[], status: 200 };
};

function groupNoteTypesByItemId(
  notes: UserNoteMinimalResponse[],
): Map<number, NoteType[]> {
  return notes.reduce((map, note) => {
    const types = map.get(note.id) ?? [];
    map.set(note.id, [...types, note.note]);
    return map;
  }, new Map<number, NoteType[]>());
}

function mapToUserNotes(notes: UserNoteMinimalResponse[]): UserNotesHistory {
  const movies = groupNoteTypesByItemId(
    notes.filter((note) => note.type === 'movie'),
  );
  const shows = groupNoteTypesByItemId(
    notes.filter((note) => note.type === 'show'),
  );

  return { movies, shows };
}

export const currentUserNotesQuery = defineQuery({
  key: 'currentUserNotes',
  invalidations: [
    InvalidateAction.Note.Add('movie'),
    InvalidateAction.Note.Add('show'),
    InvalidateAction.Note.Edit('movie'),
    InvalidateAction.Note.Edit('show'),
    InvalidateAction.Note.Delete('movie'),
    InvalidateAction.Note.Delete('show'),
    InvalidateAction.Favorited('movie'),
    InvalidateAction.Favorited('show'),
  ],
  dependencies: [],
  request: currentUserNotesRequest,
  mapper: (response) => mapToUserNotes(response.body),
  schema: UserNotesHistorySchema,
  ttl: time.hours(3),
});
