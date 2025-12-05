import type { ApiParams } from '../../../requests/api.ts';

export function buildCommonOptions<TRequestParams extends ApiParams>(
  params: {
    ttl: number | Nil;
    refetchOnWindowFocus?: boolean;
    retry?: number;
    enabled?: (params: TRequestParams) => boolean;
  },
  requestParams: TRequestParams,
) {
  return {
    staleTime: params.ttl == null ? undefined : params.ttl,
    refetchOnWindowFocus: params.refetchOnWindowFocus,
    retry: params.retry,
    enabled: params.enabled?.(requestParams) ?? true,
  };
}
