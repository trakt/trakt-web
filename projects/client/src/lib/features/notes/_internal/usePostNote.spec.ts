import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePostNote } from './usePostNote.ts';

describe('usePostNote', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should resolve to false when saving fails', async () => {
    server.use(
      http.post(
        'http://localhost/v3/users/me/notes',
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const { postNote } = await renderStore(() => usePostNote());

    const result = await postNote({
      media: { type: 'show', id: 1 },
      notes: 'note',
      type: 'note',
    });

    expect(result).toBe(false);
  });
});
