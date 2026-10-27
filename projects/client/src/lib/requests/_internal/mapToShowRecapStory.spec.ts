import { ShowRecapStoryMappedMock } from '$mocks/data/summary/season-recap/mapped/ShowRecapStoryMappedMock.ts';
import { ShowRecapStoryResponseMock } from '$mocks/data/summary/season-recap/response/ShowRecapStoryResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToShowRecapStory } from './mapToShowRecapStory.ts';

describe('mapper: mapToShowRecapStory', () => {
  it('should map the story with relative links and the latest lines', () => {
    expect(mapToShowRecapStory(ShowRecapStoryResponseMock)).to.deep.equal(
      ShowRecapStoryMappedMock,
    );
  });

  it('should map to nothing without a response', () => {
    expect(mapToShowRecapStory(undefined)).toBeNull();
  });
});
