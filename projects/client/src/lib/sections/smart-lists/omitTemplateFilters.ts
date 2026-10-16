import { fromSmartListTemplateParams } from './fromSmartListTemplateParams.ts';

type OmitTemplateFiltersProps = {
  filters: Record<string, string>;
  searchParams: URLSearchParams;
};

export function omitTemplateFilters(
  { filters, searchParams }: OmitTemplateFiltersProps,
): Record<string, string> {
  if (!fromSmartListTemplateParams(searchParams).target) {
    return filters;
  }

  return Object.fromEntries(
    Object.entries(filters).filter(([key]) => !searchParams.has(key)),
  );
}
