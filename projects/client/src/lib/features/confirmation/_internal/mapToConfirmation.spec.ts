import { describe, expect, it } from 'vitest';
import { ConfirmationType } from '../models/ConfirmationType.ts';
import { mapToConfirmation } from './mapToConfirmation.ts';

describe('mapToConfirmation', () => {
  it('should build a destructive confirmation for BlockUser with the username interpolated', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.BlockUser,
      username: 'harry',
    });

    expect(result.operation).toBe('destructive');
    expect(result.buttonText).toBeTruthy();
    expect(result.message).toContain('harry');
  });

  it('should build a destructive confirmation for UnfollowUser with the username interpolated', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.UnfollowUser,
      username: 'harry',
    });

    expect(result.operation).toBe('destructive');
    expect(result.message).toContain('harry');
  });

  it('should build a destructive confirmation for DiscardChanges', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.DiscardChanges,
    });

    expect(result.operation).toBe('destructive');
    expect(result.buttonText).toBeTruthy();
    expect(result.message).toBeTruthy();
  });

  describe('for CleanUpHistory', () => {
    const cleanUpHistory = (keeps: 'oldest' | 'newest') =>
      mapToConfirmation({
        type: ConfirmationType.CleanUpHistory,
        count: 12,
        keeps,
      });

    it.each<'oldest' | 'newest'>(['oldest', 'newest'])(
      'should spell out that the %s play is kept',
      (keeps) => {
        const result = cleanUpHistory(keeps);

        expect(result.operation).toBe('destructive');
        expect(result.message).toContain('12');
        expect(result.message).toContain(keeps);
      },
    );

    it('should warn differently depending on which play is kept', () => {
      const oldest = cleanUpHistory('oldest');
      const newest = cleanUpHistory('newest');

      expect(oldest.message).not.toBe(newest.message);
      expect(oldest.title).toBe(newest.title);
      expect(oldest.buttonText).toBe(newest.buttonText);
    });
  });
});
