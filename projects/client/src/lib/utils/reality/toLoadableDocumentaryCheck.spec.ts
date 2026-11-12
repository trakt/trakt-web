import type { DocumentaryCheck } from '$lib/requests/models/DocumentaryCheck.ts';
import { DocumentaryCheckPublicMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckPublicMappedMock.ts';
import type { QueryObserverResult } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';
import { toLoadableDocumentaryCheck } from './toLoadableDocumentaryCheck.ts';

const toQuery = (query: {
  isLoading: boolean;
  isPending: boolean;
  data?: DocumentaryCheck | null;
}) => query as QueryObserverResult<DocumentaryCheck | Nil>;

const SETTLED = {
  isLoading: false,
  isPending: false,
  data: DocumentaryCheckPublicMappedMock,
};

const WAITING = { isLoading: false, isPending: true, data: undefined };

describe('util: toLoadableDocumentaryCheck', () => {
  it('should be the check once loaded', () => {
    expect(
      toLoadableDocumentaryCheck({
        isAuthorized: true,
        isDocumentary: true,
        query: toQuery(SETTLED),
      }),
    ).toBe(DocumentaryCheckPublicMappedMock);
  });

  it('should keep loading for a documentary whose query has not started', () => {
    expect(
      toLoadableDocumentaryCheck({
        isAuthorized: true,
        isDocumentary: true,
        query: toQuery(WAITING),
      }),
    ).toBeUndefined();
  });

  it('should keep loading until the genres are known', () => {
    expect(
      toLoadableDocumentaryCheck({
        isAuthorized: true,
        isDocumentary: undefined,
        query: toQuery(WAITING),
      }),
    ).toBeUndefined();
  });

  it('should resolve to nothing for another genre whose query is off', () => {
    expect(
      toLoadableDocumentaryCheck({
        isAuthorized: true,
        isDocumentary: false,
        query: toQuery(WAITING),
      }),
    ).toBeNull();
  });

  it('should resolve to nothing when signed out', () => {
    expect(
      toLoadableDocumentaryCheck({
        isAuthorized: false,
        isDocumentary: true,
        query: toQuery(WAITING),
      }),
    ).toBeNull();
  });

  it('should resolve to nothing when the documentary has no check', () => {
    expect(
      toLoadableDocumentaryCheck({
        isAuthorized: true,
        isDocumentary: true,
        query: toQuery({ isLoading: false, isPending: false, data: null }),
      }),
    ).toBeNull();
  });
});
