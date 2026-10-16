import { describe, expect, it } from 'vitest';
import { omitTemplateFilters } from './omitTemplateFilters.ts';

describe('omitTemplateFilters', () => {
  it('should keep every filter on a regular create', () => {
    const filters = omitTemplateFilters({
      filters: { ratings: '60-100', genres: 'drama' },
      searchParams: new URLSearchParams('ratings=60-100&genres=drama'),
    });

    expect(filters).toEqual({ ratings: '60-100', genres: 'drama' });
  });

  it('should drop the filters a template owns', () => {
    const filters = omitTemplateFilters({
      filters: { ratings: '78-100', genres: 'drama' },
      searchParams: new URLSearchParams(
        'source=popular&name=Gems&ratings=78-100',
      ),
    });

    expect(filters).toEqual({ genres: 'drama' });
  });
});
