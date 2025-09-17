import { describe, expect, it } from 'vitest';
import {
  toRottenAudienceRating,
  toRottenCriticRating,
} from './toRottenTomatoRating.ts';

describe('toRottenTomatoRating', () => {
  it('should return "unrated" when rating is 0', () => {
    expect(toRottenCriticRating(0)).toBe('unrated');
  });

  it('should return "unrated" when there is no rating', () => {
    expect(toRottenCriticRating()).toBe('unrated');
  });

  it('should return "rotten" when rating is less than 60', () => {
    expect(toRottenCriticRating(0.59)).toBe('rotten');
    expect(toRottenCriticRating(0.1)).toBe('rotten');
    expect(toRottenCriticRating(0.3)).toBe('rotten');
  });

  it('should return "fresh" when rating is 60 or greater', () => {
    expect(toRottenCriticRating(0.6)).toBe('fresh');
    expect(toRottenCriticRating(0.75)).toBe('fresh');
    expect(toRottenCriticRating(1)).toBe('fresh');
  });

  it('should return "unrated" when rating is 0', () => {
    expect(toRottenAudienceRating(0)).toBe('unrated');
  });

  it('should return "unrated" when there is no rating', () => {
    expect(toRottenAudienceRating()).toBe('unrated');
  });

  it('should return "stale" when rating is less than 60', () => {
    expect(toRottenAudienceRating(0.59)).toBe('stale');
    expect(toRottenAudienceRating(0.1)).toBe('stale');
    expect(toRottenAudienceRating(0.30)).toBe('stale');
  });

  it('should return "hot" when rating is 60 or greater', () => {
    expect(toRottenAudienceRating(0.60)).toBe('hot');
    expect(toRottenAudienceRating(0.75)).toBe('hot');
    expect(toRottenAudienceRating(1)).toBe('hot');
  });
});
