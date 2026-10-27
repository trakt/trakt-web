import { SeasonRecapPublicMappedMock } from '$mocks/data/summary/season-recap/mapped/SeasonRecapPublicMappedMock.ts';
import { SeasonRecapVipMappedMock } from '$mocks/data/summary/season-recap/mapped/SeasonRecapVipMappedMock.ts';
import { SeasonRecapPublicResponseMock } from '$mocks/data/summary/season-recap/response/SeasonRecapPublicResponseMock.ts';
import { SeasonRecapVipResponseMock } from '$mocks/data/summary/season-recap/response/SeasonRecapVipResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToSeasonRecap } from './mapToSeasonRecap.ts';

describe('mapper: mapToSeasonRecap', () => {
  it('should map the public shape without chapters or a story', () => {
    expect(mapToSeasonRecap(SeasonRecapPublicResponseMock)).to.deep.equal(
      SeasonRecapPublicMappedMock,
    );
  });

  it('should map the VIP shape with chapters and relative links', () => {
    expect(mapToSeasonRecap(SeasonRecapVipResponseMock)).to.deep.equal(
      SeasonRecapVipMappedMock,
    );
  });

  it('should not offer a story when the segment is blank', () => {
    expect(
      mapToSeasonRecap({ ...SeasonRecapVipResponseMock, storySegment: ' ' })
        ?.hasStory,
    ).toBe(false);
  });

  it('should not offer a story for a show that stands alone', () => {
    expect(
      mapToSeasonRecap({ ...SeasonRecapVipResponseMock, storySegment: null })
        ?.hasStory,
    ).toBe(false);
  });

  it('should map a missing attribution to null', () => {
    expect(
      mapToSeasonRecap({ ...SeasonRecapPublicResponseMock, attribution: null })
        ?.attribution,
    ).toBeNull();
  });

  it('should map to nothing without a response', () => {
    expect(mapToSeasonRecap(undefined)).toBeNull();
  });
});
