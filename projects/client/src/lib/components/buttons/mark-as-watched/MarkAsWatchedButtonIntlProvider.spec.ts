import * as m from '$lib/features/i18n/messages.ts';
import { describe, expect, it } from 'vitest';
import { MarkAsWatchedButtonIntlProvider } from './MarkAsWatchedButtonIntlProvider.ts';

describe('util: MarkAsWatchedButtonIntlProvider', () => {
  const title = 'Heretic';

  describe('label', () => {
    it('should return mark-as-watched label for a first watch', () => {
      const label = MarkAsWatchedButtonIntlProvider.label({
        title,
        isRemovable: false,
        isRewatching: false,
      });

      expect(label).to.equal(m.button_label_mark_as_watched({ title }));
    });

    it('should return mark-as-watched label for a rewatch that is not removable', () => {
      const label = MarkAsWatchedButtonIntlProvider.label({
        title,
        isRemovable: false,
        isRewatching: true,
      });

      expect(label).to.equal(m.button_label_mark_as_watched({ title }));
    });

    it('should return remove-from-watched label when the watch is removable', () => {
      const label = MarkAsWatchedButtonIntlProvider.label({
        title,
        isRemovable: true,
        isRewatching: false,
      });

      expect(label).to.equal(m.button_label_remove_from_watched({ title }));
    });
  });

  describe('text', () => {
    it('should return track text for a first watch', () => {
      const text = MarkAsWatchedButtonIntlProvider.text({
        title,
        isRemovable: false,
        isRewatching: false,
      });

      expect(text).to.equal(m.button_text_track());
    });

    it('should return watch-again text for a rewatch that is not removable', () => {
      const text = MarkAsWatchedButtonIntlProvider.text({
        title,
        isRemovable: false,
        isRewatching: true,
      });

      expect(text).to.equal(m.button_text_watch_again());
    });

    it('should return remove-from-history text when the watch is removable', () => {
      const text = MarkAsWatchedButtonIntlProvider.text({
        title,
        isRemovable: true,
        isRewatching: false,
      });

      expect(text).to.equal(m.button_text_remove_from_history());
    });
  });
});
