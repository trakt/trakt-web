import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { useSaveList } from './useSaveList.ts';

vi.mock('$lib/stores/useInvalidator.ts');

describe('store: useSaveList', () => {
  const invalidateAll = vi.fn(async function () {});

  beforeEach(() => {
    setAuthorization(true);
    invalidateAll.mockReset();

    (useInvalidator as Mock).mockReturnValue({ invalidateAll });
  });

  describe('type: update', () => {
    it('should send the default sort fields when provided', async () => {
      let requestBody: unknown;

      server.use(
        http.put(
          'http://localhost/users/me/lists/some-list/',
          async ({ request }) => {
            requestBody = await request.json();
            return HttpResponse.json({ ids: { slug: 'some-list' } });
          },
        ),
      );

      const { saveList } = await renderStore(() =>
        useSaveList({ type: 'update', listId: 'some-list' })
      );

      await saveList({
        name: 'My List',
        privacy: 'private',
        sortBy: 'released',
        sortHow: 'asc',
      });

      expect(requestBody).to.deep.include({
        sort_by: 'released',
        sort_how: 'asc',
      });
    });

    it('should invalidate the list-edited and listed caches after saving', async () => {
      server.use(
        http.put(
          'http://localhost/users/me/lists/some-list/',
          () => HttpResponse.json({ ids: { slug: 'some-list' } }),
        ),
      );

      const { saveList } = await renderStore(() =>
        useSaveList({ type: 'update', listId: 'some-list' })
      );

      await saveList({ name: 'My List', privacy: 'private' });

      expect(invalidateAll).toHaveBeenCalledWith([
        InvalidateAction.List.Edited,
        InvalidateAction.Listed('movie'),
        InvalidateAction.Listed('show'),
      ]);
    });
  });

  describe('type: create', () => {
    it('should NOT send sort fields', async () => {
      let requestBody: unknown;

      server.use(
        http.post(
          'http://localhost/users/me/lists',
          async ({ request }) => {
            requestBody = await request.json();
            return HttpResponse.json({}, { status: 201 });
          },
        ),
      );

      const { saveList } = await renderStore(() =>
        useSaveList({ type: 'create' })
      );

      await saveList({
        name: 'My List',
        privacy: 'private',
        sortBy: 'released',
        sortHow: 'asc',
      });

      expect(requestBody).to.not.have.property('sort_by');
      expect(requestBody).to.not.have.property('sort_how');
    });

    it('should invalidate the list-created cache after saving', async () => {
      server.use(
        http.post(
          'http://localhost/users/me/lists',
          () => HttpResponse.json({}, { status: 201 }),
        ),
      );

      const { saveList } = await renderStore(() =>
        useSaveList({ type: 'create' })
      );

      await saveList({ name: 'My List', privacy: 'private' });

      expect(invalidateAll).toHaveBeenCalledWith([
        InvalidateAction.List.Created,
      ]);
    });
  });
});
