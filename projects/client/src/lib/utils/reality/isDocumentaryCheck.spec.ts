import { DocumentaryCheckPublicMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckPublicMappedMock.ts';
import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { isDocumentaryCheck } from './isDocumentaryCheck.ts';

describe('util: isDocumentaryCheck', () => {
  it('should recognise a documentary check', () => {
    expect(isDocumentaryCheck(DocumentaryCheckPublicMappedMock)).to.equal(true);
  });

  it('should not mistake a story check for a documentary check', () => {
    expect(isDocumentaryCheck(RealityCheckPublicMappedMock)).to.equal(false);
  });
});
