import type { UserSettings } from '$lib/features/auth/queries/currentUserSettingsQuery.ts';
import { ExtendedUserMappedMock } from '$mocks/data/users/mapped/ExtendedUserSettingsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { SimpleRating } from '../../../models/SimpleRating.ts';
import type {
  ListFilter,
  RatingsFilter,
  ToggleFilter,
} from '../models/Filter.ts';
import { FilterKey } from '../models/Filter.ts';
import { mapToSearchParamValue } from './mapToSearchParamValue.ts';

const mockUser: UserSettings = {
  ...ExtendedUserMappedMock,
  genres: ['action', 'comedy', 'drama'],
};

describe('mapToSearchParamValue', () => {
  describe('toggle filters', () => {
    const toggleFilter: ToggleFilter = {
      key: FilterKey.IgnoreWatched,
      label: 'Ignore Watched',
      type: 'toggle',
      defaultValue: 'true',
    };

    it('should return provided value for toggle filter', () => {
      const result = mapToSearchParamValue({
        filter: toggleFilter,
        value: 'false',
        user: mockUser,
      });

      expect(result).toBe('false');
    });

    it('should return default value when value is undefined for toggle filter', () => {
      const result = mapToSearchParamValue({
        filter: toggleFilter,
        value: undefined,
        user: mockUser,
      });

      expect(result).toBe('true');
    });
  });

  describe('list filters', () => {
    const listFilter: ListFilter = {
      key: FilterKey.Genres,
      label: 'Genres',
      type: 'list',
      options: [
        {
          label: 'My Favorites',
          value: 'favorites',
          mapper: (user) => user.genres.join(','),
        },
        { label: 'Action', value: 'action' },
        { label: 'Comedy', value: 'comedy' },
      ],
    };

    it('should return mapped value when mapper exists', () => {
      const result = mapToSearchParamValue({
        filter: listFilter,
        value: 'favorites',
        user: mockUser,
      });

      expect(result).toBe('action,comedy,drama');
    });

    it('should return original value when no mapper exists', () => {
      const result = mapToSearchParamValue({
        filter: listFilter,
        value: 'action',
        user: mockUser,
      });

      expect(result).toBe('action');
    });

    it('should throw error when value is undefined for list filter', () => {
      expect(() => {
        mapToSearchParamValue({
          filter: listFilter,
          value: undefined,
          user: mockUser,
        });
      }).toThrow('Filter value is required');
    });
  });

  describe('ratings filters', () => {
    const ratingsFilter: RatingsFilter = {
      key: FilterKey.Ratings,
      label: 'Ratings',
      type: 'ratings',
      options: [
        { rating: SimpleRating.Great, value: '9,10' },
        { rating: SimpleRating.Good, value: '7,8,9,10' },
      ],
    };

    it('should return original value for ratings filter', () => {
      const result = mapToSearchParamValue({
        filter: ratingsFilter,
        value: '9,10',
        user: mockUser,
      });

      expect(result).toBe('9,10');
    });
  });
});
