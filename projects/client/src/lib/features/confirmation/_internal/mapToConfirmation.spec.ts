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
});
