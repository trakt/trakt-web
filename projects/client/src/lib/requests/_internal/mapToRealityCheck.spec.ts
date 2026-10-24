import { RealityCheckPublicMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckPublicMappedMock.ts';
import { RealityCheckVipMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckVipMappedMock.ts';
import { RealityCheckPublicResponseMock } from '$mocks/data/summary/reality-check/response/RealityCheckPublicResponseMock.ts';
import { RealityCheckVipResponseMock } from '$mocks/data/summary/reality-check/response/RealityCheckVipResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToRealityCheck } from './mapToRealityCheck.ts';

describe('mapper: mapToRealityCheck', () => {
  it('should map the public shape without detail', () => {
    expect(mapToRealityCheck(RealityCheckPublicResponseMock)).to.deep.equal(
      RealityCheckPublicMappedMock,
    );
  });

  it('should map the VIP shape with relative links, story claims and web sources only', () => {
    expect(mapToRealityCheck(RealityCheckVipResponseMock)).to.deep.equal(
      RealityCheckVipMappedMock,
    );
  });

  it('should map to nothing when the title is not applicable', () => {
    expect(
      mapToRealityCheck({
        ...RealityCheckPublicResponseMock,
        applicable: false,
      }),
    ).to.equal(null);
  });

  it('should map to nothing without a response', () => {
    expect(mapToRealityCheck(undefined)).to.equal(null);
  });
});
