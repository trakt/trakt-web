import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import type { MediaType } from '../../models/MediaType.ts';
import { type UserNote, UserNoteSchema } from '../../models/UserNote.ts';
import {
  type UserNoteResponse,
  UserNoteResponseSchema,
} from '../../models/UserNoteResponse.ts';

type UserNotesParams = {
  type: MediaType;
  slug: string;
} & ApiParams;

const UserNotesResponseSchema = z.array(UserNoteResponseSchema);
type UserNotesResponse = z.infer<typeof UserNotesResponseSchema>;

function toUserNote(response: UserNoteResponse): UserNote {
  return {
    id: response.id,
    notes: response.notes,
    createdAt: new Date(response.created_at),
    updatedAt: new Date(response.updated_at),
    type: response.type,
  };
}

const userNotesRequest = async ({ fetch, type, slug }: UserNotesParams) => {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/notes/${type}/${slug}`,
  });

  return response.ok
    ? {
      body: UserNotesResponseSchema.parse(await response.json()),
      status: 200,
    }
    : { body: [] as UserNotesResponse, status: 200 };
};

export const userNotesNotesQuery = defineQuery({
  key: 'userNotes',
  invalidations: [
    InvalidateAction.Note.Add('movie'),
    InvalidateAction.Note.Add('show'),
    InvalidateAction.Favorited('movie'),
    InvalidateAction.Favorited('show'),
  ],
  dependencies: (params) => [params.type, params.slug],
  request: userNotesRequest,
  mapper: (response) => response.body.map(toUserNote),
  schema: UserNoteSchema.array(),
  ttl: time.minutes(5),
});
