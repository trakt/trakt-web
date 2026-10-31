import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { describe, expect, it } from 'vitest';
import { yirPersonaQuery } from './yirPersonaQuery.ts';

describe('yirPersonaQuery', () => {
  it('should refetch when the VIP status changes', () => {
    const { queryKey } = yirPersonaQuery({ slug: 'me', year: 2025 });

    expect(queryKey).to.include(InvalidateAction.Vip.Updated);
  });
});
