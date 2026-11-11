import type { IssueReport } from '../models/IssueReport.ts';

const appendAll = (
  form: FormData,
  key: string,
  values: ReadonlyArray<string | File>,
): FormData => {
  values.forEach((value) => form.append(key, value));
  return form;
};

export function toIssueReportFormData(report: IssueReport): FormData {
  const form = new FormData();

  switch (report.kind) {
    case 'import':
      form.set('kind', report.kind);
      form.set('source', report.source);
      form.set('sourceName', report.sourceName);
      form.set('message', report.message);
      return appendAll(form, 'files', report.files);
    case 'search':
      form.set('kind', report.kind);
      form.set('query', report.query);
      form.set('intent', report.intent);
      form.set('link', report.link);
      form.set('expected', report.expected);
      form.set('mode', report.mode);
      return appendAll(form, 'results', report.results);
  }
}
