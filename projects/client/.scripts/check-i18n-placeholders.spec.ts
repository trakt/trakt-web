import { describe, expect, it } from 'vitest';
import {
  extractPlaceholders,
  findMismatches,
} from './check-i18n-placeholders.ts';

describe('check-i18n-placeholders', () => {
  describe('extractPlaceholders', () => {
    it('should extract single placeholder', () => {
      expect(extractPlaceholders('Remove {title}'))
        .toEqual(new Set(['title']));
    });

    it('should extract multiple placeholders', () => {
      expect(extractPlaceholders('{count} of {total}'))
        .toEqual(new Set(['count', 'total']));
    });

    it('should extract ICU plural placeholder name', () => {
      expect(
        extractPlaceholders('{count, plural, one {episode} other {episodes}}'),
      )
        .toEqual(new Set(['count']));
    });

    it('should extract ICU select placeholder name', () => {
      expect(
        extractPlaceholders(
          '{gender, select, male {he} female {she} other {they}}',
        ),
      )
        .toEqual(new Set(['gender']));
    });

    it('should extract nested placeholders inside ICU plural form content', () => {
      expect(
        extractPlaceholders(
          '{count, plural, one {{name} has {count} episode} other {{name} has {count} episodes}}',
        ),
      ).toEqual(new Set(['count', 'name']));
    });

    it('should not treat plain form literals as placeholders', () => {
      expect(
        extractPlaceholders('{count, plural, one {episode} other {episodes}}'),
      ).toEqual(new Set(['count']));
    });

    it('should ignore mangled placeholder with backslash', () => {
      expect(extractPlaceholders('Remove "{\\s_title}"'))
        .toEqual(new Set());
    });

    it('should return empty set for text without placeholders', () => {
      expect(extractPlaceholders('plain text')).toEqual(new Set());
    });
  });

  describe('findMismatches', () => {
    it('should pass when target placeholders match source', () => {
      const source = { greeting: 'Hello {name}' };
      const target = { greeting: 'Hallo {name}' };
      expect(findMismatches(source, target, 'de')).toEqual([]);
    });

    it('should flag mangled {\\s_X} as missing source placeholder', () => {
      const source = { key: 'Remove "{title}"' };
      const target = { key: 'Entferne "{\\s_title}"' };
      const result = findMismatches(source, target, 'de');
      expect(result).toHaveLength(1);
      expect(result[0]?.reason).toContain('missing in target: title');
    });

    it('should flag extra placeholders not in source', () => {
      const source = { greeting: 'Hello {name}' };
      const target = { greeting: 'Hallo {name} {extra}' };
      const result = findMismatches(source, target, 'de');
      expect(result).toHaveLength(1);
      expect(result[0]?.reason).toContain('extra in target: extra');
    });

    it('should flag missing placeholders in target', () => {
      const source = { greeting: 'Reply to {user}' };
      const target = { greeting: 'Responder...' };
      const result = findMismatches(source, target, 'pt');
      expect(result).toHaveLength(1);
      expect(result[0]?.reason).toContain('missing in target: user');
    });

    it('should pass for matching ICU plurals', () => {
      const source = {
        units: '{count, plural, one {episode} other {episodes}}',
      };
      const target = {
        units: '{count, plural, one {episodio} other {episodios}}',
      };
      expect(findMismatches(source, target, 'es')).toEqual([]);
    });

    it('should skip keys missing from source', () => {
      const source = {};
      const target = { greeting: 'Hallo {name}' };
      expect(findMismatches(source, target, 'de')).toEqual([]);
    });
  });
});
