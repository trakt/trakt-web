import { DocumentaryCheckPublicMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckPublicMappedMock.ts';
import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { selectRealityCheck } from './selectRealityCheck.ts';

describe('util: selectRealityCheck', () => {
  it('should prefer the documentary check over the story check', () => {
    expect(
      selectRealityCheck({
        story: RealityCheckPublicMappedMock,
        documentary: DocumentaryCheckPublicMappedMock,
      }),
    ).to.equal(DocumentaryCheckPublicMappedMock);
  });

  it('should show the documentary check without waiting for the story check', () => {
    expect(
      selectRealityCheck({
        story: undefined,
        documentary: DocumentaryCheckPublicMappedMock,
      }),
    ).to.equal(DocumentaryCheckPublicMappedMock);
  });

  it('should fall back to the story check when there is no documentary check', () => {
    expect(
      selectRealityCheck({
        story: RealityCheckPublicMappedMock,
        documentary: null,
      }),
    ).to.equal(RealityCheckPublicMappedMock);
  });

  it('should keep loading while the documentary check loads', () => {
    expect(
      selectRealityCheck({
        story: RealityCheckPublicMappedMock,
        documentary: undefined,
      }),
    ).to.equal(undefined);
  });

  it('should keep loading while the story check loads', () => {
    expect(
      selectRealityCheck({ story: undefined, documentary: null }),
    ).to.equal(undefined);
  });

  it('should resolve to nothing when neither check exists', () => {
    expect(selectRealityCheck({ story: null, documentary: null })).to.equal(
      null,
    );
  });
});
