import { YirDetailMappedMock } from '$mocks/data/users/mapped/YirDetailMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { buildYirScenes } from './buildYirScenes.ts';

describe('util: buildYirScenes', () => {
  it('should return no scenes without detail', () => {
    expect(buildYirScenes(null)).toEqual([]);
  });

  it('should order scenes from first play to thanks', () => {
    const kinds = buildYirScenes(YirDetailMappedMock).map((scene) =>
      scene.kind
    );

    expect(kinds.at(0)).toBe('play');
    expect(kinds.at(-1)).toBe('thanks');
    expect(kinds.indexOf('credits')).toBeLessThan(kinds.lastIndexOf('play'));
  });

  it('should skip sections without data', () => {
    const ids = buildYirScenes(YirDetailMappedMock).map((scene) => scene.id);

    expect(ids).toContain('section-shows-companies');
    expect(ids).not.toContain('section-movies-companies');
    expect(ids).not.toContain('section-movies-countries');
    expect(ids).not.toContain('section-movies-trends');
  });

  it('should skip a media type without plays', () => {
    const detail = {
      ...YirDetailMappedMock,
      stats: {
        ...YirDetailMappedMock.stats,
        movies: {
          ...YirDetailMappedMock.stats.movies,
          playCounts: {
            ...YirDetailMappedMock.stats.movies.playCounts,
            total: 0,
          },
        },
      },
    };

    const ids = buildYirScenes(detail).map((scene) => scene.id);

    expect(ids.some((id) => id.startsWith('section-movies'))).toBe(false);
  });

  it('should drop thanks when there is nothing to recommend', () => {
    const detail = { ...YirDetailMappedMock, thanks: null };

    expect(buildYirScenes(detail).map((scene) => scene.kind)).not.toContain(
      'thanks',
    );
  });

  it('should give every scene a unique id', () => {
    const ids = buildYirScenes(YirDetailMappedMock).map((scene) => scene.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});
