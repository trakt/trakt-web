import type { ApiApplicationResponse } from '$lib/requests/queries/apps/_internal/ApiApplicationResponse.ts';
import { http, HttpResponse } from 'msw';
import { ApiApplicationsResponseMock } from '../data/apps/response/ApiApplicationsResponseMock.ts';
import { ConnectedAppsResponseMock } from '../data/apps/response/ConnectedAppsResponseMock.ts';

type CreateApiApplicationBody = {
  name: string;
  description?: string;
  redirect_uri: string[];
  origins?: string[];
  scrobble?: boolean;
  checkin?: boolean;
};

export const apps = [
  http.get(
    'http://localhost/v3/users/me/connected-apps',
    () => HttpResponse.json(ConnectedAppsResponseMock),
  ),
  http.get(
    'http://localhost/v3/users/me/applications',
    () => HttpResponse.json(ApiApplicationsResponseMock),
  ),
  http.post(
    'http://localhost/v3/users/me/applications',
    async ({ request }) => {
      const body = await request.json() as CreateApiApplicationBody;

      const created: ApiApplicationResponse = {
        id: 903,
        name: body.name,
        description: body.description ?? null,
        client_id: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
        client_secret: 'f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b',
        redirect_uri: (body.redirect_uri ?? []).join('\n'),
        origins: body.origins ?? [],
        approved: true,
        approved_at: '2025-06-29T12:00:00.000Z',
        scopes: [],
        permissions: {
          scrobble: Boolean(body.scrobble),
          checkin: Boolean(body.checkin),
          account_create: false,
        },
        created_at: '2025-06-29T12:00:00.000Z',
      };

      return HttpResponse.json(created, { status: 201 });
    },
  ),
  http.patch(
    'http://localhost/v3/users/me/applications/:id',
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.delete(
    'http://localhost/v3/users/me/applications/:id',
    () => new HttpResponse(null, { status: 204 }),
  ),
  http.delete(
    'http://localhost/v3/users/me/connected-apps/:id',
    () => new HttpResponse(null, { status: 204 }),
  ),
];
