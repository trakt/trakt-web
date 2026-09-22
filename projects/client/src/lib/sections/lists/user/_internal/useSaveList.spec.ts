import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useSaveList } from './useSaveList.ts';

describe('store: useSaveList', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  const isInvalidated = (
    { client, action }: {
      client: ReturnType<typeof useQueryClient>;
      action: string;
    },
  ) => client.getQueryState([action])?.isInvalidated;

  const renderSeeded = (props: Parameters<typeof useSaveList>[0]) =>
    renderStore(() => {
      const client = useQueryClient();
      const actions = [
        InvalidateAction.List.Created,
        InvalidateAction.List.Edited,
        InvalidateAction.Listed('movie'),
        InvalidateAction.Listed('show'),
      ];
      actions.forEach((action) => client.setQueryData([action], {}));

      return { client, actions, ...useSaveList(props) };
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

      const { saveList, client, actions } = await renderSeeded({
        type: 'update',
        listId: 'some-list',
      });

      await saveList({ name: 'My List', privacy: 'private' });

      expect(
        actions.filter((action) => isInvalidated({ client, action })),
      ).to.deep.equal([
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

      const { saveList, client, actions } = await renderSeeded({
        type: 'create',
      });

      await saveList({ name: 'My List', privacy: 'private' });

      expect(
        actions.filter((action) => isInvalidated({ client, action })),
      ).to.deep.equal([InvalidateAction.List.Created]);
    });
  });
});
