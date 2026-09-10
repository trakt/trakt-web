import { SiloListsMappedMock } from '$mocks/data/summary/shows/silo/mapped/SiloListsMappedMock.ts';
import { captureRequests } from '$test/beds/request/captureRequests.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useLikeList } from './useLikeList.ts';

const list = assertDefined(SiloListsMappedMock.at(0));

describe('store: useLikeList', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should NOT be updating when first requested', async () => {
    const { isUpdating } = await renderStore(() => useLikeList(list));

    expect(await firstValueFrom(isUpdating)).toBe(false);
  });

  it('should be updating while the like is in flight', async () => {
    const { isUpdating, likeList } = await renderStore(() => useLikeList(list));

    likeList();

    expect(await firstValueFrom(isUpdating)).toBe(true);
  });

  it('should stop updating once the like resolves', async () => {
    const { isUpdating, likeList } = await renderStore(() => useLikeList(list));

    await likeList();

    expect(await firstValueFrom(isUpdating)).toBe(false);
  });

  it('should like and unlike through the list endpoint', async () => {
    const { likeList, unlikeList } = await renderStore(() => useLikeList(list));

    const requests = await captureRequests(async () => {
      await likeList();
      await unlikeList();
    });

    expect(requests).to.include.members([
      `POST /lists/${list.id}/like`,
      `DELETE /lists/${list.id}/like`,
    ]);
  });
});
