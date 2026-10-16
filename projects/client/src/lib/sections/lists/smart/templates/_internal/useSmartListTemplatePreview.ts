import { useQuery } from '$lib/features/query/useQuery.ts';
import type { SmartListTemplate } from '$lib/requests/models/SmartListTemplate.ts';
import { smartListTemplatePreviewQuery } from '$lib/requests/queries/smart-lists/smartListTemplatePreviewQuery.ts';
import { toSmartListFilterParams } from '$lib/sections/smart-lists/toSmartListFilterParams.ts';
import { combineLatest, map, type Observable } from 'rxjs';

type SmartListTemplatePreview = Pick<SmartListTemplate, 'total' | 'posters'>;

export function useSmartListTemplatePreview(
  template$: Observable<SmartListTemplate>,
): Observable<SmartListTemplatePreview> {
  const query$ = useQuery(
    template$.pipe(
      map((template) => ({
        ...smartListTemplatePreviewQuery({
          source: template.source,
          mediaType: template.mediaType,
          filters: toSmartListFilterParams(template.filters),
        }),
        enabled: template.personal,
      })),
    ),
  );

  return combineLatest([template$, query$]).pipe(
    map(([template, $query]): SmartListTemplatePreview =>
      template.personal
        ? ($query.data ?? { total: null, posters: [] })
        : { total: template.total, posters: template.posters }
    ),
  );
}
