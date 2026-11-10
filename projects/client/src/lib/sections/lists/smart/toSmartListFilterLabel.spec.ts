import { describe, expect, it } from 'vitest';
import { OPEN_VOTES_CEILING } from './openVotesCeiling.ts';
import { toSmartListFilterLabel } from './toSmartListFilterLabel.ts';

describe('util: toSmartListFilterLabel', () => {
  describe('for string lists', () => {
    it('should uppercase certifications', () => {
      expect(
        toSmartListFilterLabel({
          key: 'certifications',
          value: ['pg-13', 'r'],
        }),
      ).toEqual(['PG-13', 'R']);
    });

    it('should title-case unknown keys', () => {
      expect(
        toSmartListFilterLabel({ key: 'networks', value: ['hbo-max'] }),
      ).toEqual(['Hbo Max']);
    });

    it('should title-case unknown watch now options', () => {
      expect(
        toSmartListFilterLabel({ key: 'watchnow', value: ['somewhere-else'] }),
      ).toEqual(['Somewhere Else']);
    });

    it('should mark excluded values', () => {
      expect(
        toSmartListFilterLabel({
          key: 'certifications',
          value: ['pg', '-r'],
        }),
      ).toEqual(['PG', 'Not R']);
    });
  });

  describe('for ranges', () => {
    it('should format a closed year range', () => {
      const [label] = toSmartListFilterLabel({
        key: 'years',
        value: [1990, 1999],
      });

      expect(label).toContain('1990');
      expect(label).toContain('1999');
    });

    it('should format open year ranges', () => {
      const [from] = toSmartListFilterLabel({ key: 'years', value: [1990] });
      const [upTo] = toSmartListFilterLabel({
        key: 'years',
        value: [undefined, 1999] as number[],
      });

      expect(from).toContain('1990');
      expect(upTo).toContain('1999');
      expect(from).not.toBe(upTo);
    });

    it('should format runtimes from zero as an upper bound', () => {
      const [upTo] = toSmartListFilterLabel({
        key: 'runtimes',
        value: [0, 90],
      });
      const [between] = toSmartListFilterLabel({
        key: 'runtimes',
        value: [60, 90],
      });
      const [from] = toSmartListFilterLabel({ key: 'runtimes', value: [120] });

      expect(upTo).toContain('90');
      expect(between).toContain('60');
      expect(between).toContain('90');
      expect(from).toContain('120+');
    });

    it('should format percent ranges with the source label', () => {
      const [between] = toSmartListFilterLabel({
        key: 'ratings',
        value: [70, 90],
      });
      const [from] = toSmartListFilterLabel({ key: 'rt_meters', value: [80] });
      const [upTo] = toSmartListFilterLabel({
        key: 'rt_user_meters',
        value: [undefined, 50] as number[],
      });

      expect(between).toContain('Trakt');
      expect(between).toContain('70');
      expect(between).toContain('90');
      expect(from).toContain('RT');
      expect(from).toContain('80');
      expect(upTo).toContain('RT Audience');
      expect(upTo).toContain('50');
    });

    it('should format closed vote ranges', () => {
      const [label] = toSmartListFilterLabel({
        key: 'votes',
        value: [1000, 5000],
      });

      expect(label).toBe('1,000 to 5,000 Trakt votes');
    });

    it('should treat a vote range up to the ceiling as open ended', () => {
      const [open] = toSmartListFilterLabel({
        key: 'imdb_votes',
        value: [1000, OPEN_VOTES_CEILING],
      });
      const [noMax] = toSmartListFilterLabel({
        key: 'imdb_votes',
        value: [1000],
      });

      expect(open).toBe(noMax);
      expect(open).toContain('IMDb');
    });

    it('should format parental guide ranges with the category', () => {
      expect(
        toSmartListFilterLabel({ key: 'parental_nudity', value: [0, 2] }),
      ).toEqual(['Sex & Nudity: None to Moderate']);
    });

    it('should ignore ranges of unknown keys', () => {
      expect(toSmartListFilterLabel({ key: 'unknown', value: [1, 2] })).toEqual(
        [],
      );
    });
  });

  describe('for awards', () => {
    const awardLabels = new Map([
      [
        'oscars-best-picture',
        {
          ceremonySlug: 'oscars',
          ceremony: 'Academy Awards',
          name: 'Best Picture',
          shortName: 'Picture',
        },
      ],
    ]);

    it('should use the award label name when known', () => {
      expect(
        toSmartListFilterLabel({
          key: 'awards',
          value: ['oscars-best-picture'],
          awardLabels,
        }),
      ).toEqual(['Best Picture']);
    });

    it('should fall back to a title-cased slug for unknown awards', () => {
      expect(
        toSmartListFilterLabel({ key: 'awards', value: ['golden-globes'] }),
      ).toEqual(['Golden Globes']);
    });

    it('should mark excluded awards', () => {
      expect(
        toSmartListFilterLabel({
          key: 'awards',
          value: ['-oscars-best-picture'],
          awardLabels,
        }),
      ).toEqual(['Not Best Picture']);
    });

    it('should describe the ceremony year range', () => {
      const [label] = toSmartListFilterLabel({
        key: 'award_years',
        value: [2000, 2010],
      });

      expect(label).toContain('2000');
      expect(label).toContain('2010');
    });

    it('should describe the award winners only toggle', () => {
      expect(toSmartListFilterLabel({ key: 'award_won', value: true })).toEqual(
        ['Winners only'],
      );
      expect(
        toSmartListFilterLabel({ key: 'award_won', value: false }),
      ).toEqual([]);
    });
  });

  describe('for scalar filters', () => {
    it('should describe how recently a title was released', () => {
      const [label] = toSmartListFilterLabel({
        key: 'released_within_days',
        value: 30,
      });

      expect(label).toContain('30');
    });

    it('should show nothing for disabled toggles or unknown scalars', () => {
      expect(
        toSmartListFilterLabel({ key: 'ignore_watched', value: false }),
      ).toEqual([]);
      expect(
        toSmartListFilterLabel({ key: 'ignore_watchlisted', value: false }),
      ).toEqual([]);
      expect(
        toSmartListFilterLabel({ key: 'released_within_days', value: 'x' }),
      ).toEqual([]);
      expect(toSmartListFilterLabel({ key: 'anything', value: null })).toEqual(
        [],
      );
    });
  });
});
