import { describe, expect, it } from 'vitest';
import { MarkAsWatchedButtonIntlProvider } from './MarkAsWatchedButtonIntlProvider.ts';

const TITLE = 'Silo';

describe('MarkAsWatchedButtonIntlProvider', () => {
  describe('label', () => {
    it('should offer removal for a watched title', () => {
      const label = MarkAsWatchedButtonIntlProvider.label({
        title: TITLE,
        isWatched: true,
        isRewatching: false,
      });

      expect(label).toContain(TITLE);
      expect(label).toMatch(/history/i);
    });

    it('should not offer removal while re-watching', () => {
      const label = MarkAsWatchedButtonIntlProvider.label({
        title: TITLE,
        isWatched: true,
        isRewatching: true,
      });

      expect(label).toContain(TITLE);
      expect(label).not.toMatch(/history/i);
    });

    it('should match the text it labels', () => {
      const meta = { title: TITLE, isWatched: true, isRewatching: true };

      expect(MarkAsWatchedButtonIntlProvider.text(meta)).toMatch(/again/i);
      expect(MarkAsWatchedButtonIntlProvider.label(meta)).not.toMatch(
        /history/i,
      );
    });
  });

  describe('text', () => {
    it('should offer to track an unwatched title', () => {
      expect(
        MarkAsWatchedButtonIntlProvider.text({
          title: TITLE,
          isWatched: false,
          isRewatching: false,
        }),
      ).not.toMatch(/history|again/i);
    });

    it('should offer removal for a watched title', () => {
      expect(
        MarkAsWatchedButtonIntlProvider.text({
          title: TITLE,
          isWatched: true,
          isRewatching: false,
        }),
      ).toMatch(/history/i);
    });
  });
});
