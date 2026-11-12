import { DocumentaryCheckPublicMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckPublicMappedMock.ts';
import { DocumentaryCheckVipMappedMock } from '$mocks/data/summary/documentary-check/mapped/DocumentaryCheckVipMappedMock.ts';
import { DocumentaryCheckPublicResponseMock } from '$mocks/data/summary/documentary-check/response/DocumentaryCheckPublicResponseMock.ts';
import { DocumentaryCheckVipResponseMock } from '$mocks/data/summary/documentary-check/response/DocumentaryCheckVipResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToDocumentaryCheck } from './mapToDocumentaryCheck.ts';

describe('mapper: mapToDocumentaryCheck', () => {
  it('should map the public shape with no disputes', () => {
    expect(
      mapToDocumentaryCheck(DocumentaryCheckPublicResponseMock),
    ).to.deep.equal(DocumentaryCheckPublicMappedMock);
  });

  it('should map the VIP shape and keep a null year and a null reply', () => {
    const mapped = mapToDocumentaryCheck(DocumentaryCheckVipResponseMock);

    expect(mapped).to.deep.equal(DocumentaryCheckVipMappedMock);
    expect(
      mapped?.disputes.map(({ year, reply }) => [year, reply]),
    ).to.include.deep.members([
      [2021, null],
      [
        null,
        'The filmmakers say the footage was filmed on three separate nights.',
      ],
    ]);
  });

  it('should map to nothing when the title is not applicable', () => {
    expect(mapToDocumentaryCheck({ applicable: false })).to.equal(null);
  });

  it('should map to nothing without a response', () => {
    expect(mapToDocumentaryCheck(undefined)).to.equal(null);
  });
});
