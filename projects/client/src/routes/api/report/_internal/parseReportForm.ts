import type { Reporter, ReportSubmission } from './ReportSubmission.ts';

const textOf = (form: FormData, key: string): string =>
  (form.get(key) ?? '').toString();

const toSlug = (value: string): string =>
  value
    .replace(/[^a-z0-9-]+/gi, '')
    .toLowerCase()
    .slice(0, 32) || 'unknown';

export function parseReportForm(
  form: FormData,
  reporter: Reporter,
): ReportSubmission | null {
  switch (textOf(form, 'kind')) {
    case 'import': {
      const source = toSlug(textOf(form, 'source'));
      return {
        ...reporter,
        kind: 'import',
        source,
        sourceName: textOf(form, 'sourceName') || source,
        message: textOf(form, 'message'),
        files: form
          .getAll('files')
          .filter((entry): entry is File => entry instanceof File),
      };
    }
    case 'search':
      return {
        ...reporter,
        kind: 'search',
        query: textOf(form, 'query'),
        intent: textOf(form, 'intent'),
        link: textOf(form, 'link').trim(),
        expected: textOf(form, 'expected'),
        mode: toSlug(textOf(form, 'mode')),
        results: form.getAll('results').map(String),
      };
    default:
      return null;
  }
}
