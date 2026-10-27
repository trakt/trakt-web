import { describe, expect, it } from 'vitest';
import { ConfirmationType } from '../models/ConfirmationType.ts';
import { mapToConfirmation } from './mapToConfirmation.ts';

describe('mapToConfirmation', () => {
  it('should require export for custom library clearing without offering a skip switch', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.ClearData,
      sourceText: 'Custom Library',
      isCustomLibrary: true,
    });
    expect(result.operation).toBe('destructive');
    expect(result.preflight).toBeUndefined();
    expect(result.buttonText).toBe('Export and clear');
    expect(result.message).toContain('Your Plex Library will not be changed.');
  });

  it('should retain the optional export switch for other data sources', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.ClearData,
      sourceText: 'Watchlist',
    });
    expect(result.preflight?.isEnabledByDefault).toBe(true);
  });

  it('should name the person in the body, not the title, when blocking', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.BlockUser,
      username: 'harry',
    });

    expect(result.operation).toBe('destructive');
    expect(result.title).not.toContain('harry');
    expect(result.message).toContain('harry');
    expect(result.buttonText).toBe('Block');
  });

  it('should name the person in the body, not the title, when unfollowing', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.UnfollowUser,
      username: 'harry',
    });

    expect(result.operation).toBe('destructive');
    expect(result.title).not.toContain('harry');
    expect(result.message).toContain('harry');
  });

  it('should name the list in the body and keep the button to the verb when deleting a list', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.DeleteList,
      name: 'Comfort rewatches',
    });

    expect(result.title).not.toContain('Comfort rewatches');
    expect(result.message).toContain('Comfort rewatches');
    expect(result.buttonText).toBe('Delete');
  });

  it('should offer to keep editing when discarding changes', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.DiscardChanges,
    });

    expect(result.operation).toBe('destructive');
    expect(result.buttonText).toBe('Discard');
    expect(result.cancelText).toBe('Keep editing');
  });

  it('should protect the subscription when cancelling VIP', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.CancelVip,
      renewsOn: '14 Dec 2026',
    });

    expect(result.operation).toBe('preventative');
    expect(result.buttonText).toBe('Cancel VIP');
    expect(result.cancelText).toBe('Keep my premium perks');
    expect(result.message).toContain('14 Dec 2026');
  });

  it.each([
    ConfirmationType.CancelImport,
    ConfirmationType.CancelClear,
    ConfirmationType.CancelExport,
  ] as const)('should offer to stay or leave for %s', (type) => {
    const result = mapToConfirmation({ type });

    expect(result.cancelText).toBe('Stay');
    expect(result.buttonText).toBe('Leave');
  });

  it('should not mention leaving when switching the clear source', () => {
    const result = mapToConfirmation({
      type: ConfirmationType.SwitchClearSource,
    });

    expect(result.message).toBe('Switching sources stops it partway.');
    expect(result.cancelText).toBe('Keep clearing');
    expect(result.buttonText).toBe('Switch');
  });

  describe('for SetCoverImage', () => {
    it('should ask affirmatively and name the media in the body', () => {
      const result = mapToConfirmation({
        type: ConfirmationType.SetCoverImage,
        title: 'Heretic',
        previewUrl: 'https://example.com/heretic.jpg',
      });

      expect(result.operation).toBe('affirmative');
      expect(result.buttonText).toBe('Set as cover');
      expect(result.title).not.toContain('Heretic');
      expect(result.message).toContain('Heretic');
    });
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
