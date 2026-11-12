import type { DocumentaryCheck } from '$lib/requests/models/DocumentaryCheck.ts';
import { toLoadableData } from '$lib/utils/requests/toLoadableData.ts';
import type { QueryObserverResult } from '@tanstack/query-core';

type LoadableDocumentaryCheckParams = {
  isAuthorized: boolean;
  isDocumentary: boolean | undefined;
  query: QueryObserverResult<DocumentaryCheck | Nil>;
};

export function toLoadableDocumentaryCheck({
  isAuthorized,
  isDocumentary,
  query,
}: LoadableDocumentaryCheckParams): DocumentaryCheck | null | undefined {
  if (isAuthorized && isDocumentary === undefined) {
    return undefined;
  }

  if (isAuthorized && isDocumentary && query.isPending) {
    return undefined;
  }

  return toLoadableData({ isAuthorized, query });
}
