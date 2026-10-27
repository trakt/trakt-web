import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useEditNote } from './useEditNote.ts';

describe('useEditNote', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should resolve to false when saving fails', async () => {
    server.use(
      http.put(
        'http://localhost/v3/users/me/notes/1',
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const { editNote } = await renderStore(() => useEditNote());

    const result = await editNote({
      id: 1,
      media: { type: 'show', id: 1 },
      notes: 'note',
      type: 'note',
    });

    expect(result).toBe(false);
  });
});
