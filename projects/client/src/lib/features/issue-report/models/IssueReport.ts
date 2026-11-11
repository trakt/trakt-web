export type ImportIssueReport = {
  kind: 'import';
  source: string;
  sourceName: string;
  message: string;
  files: ReadonlyArray<File>;
};

export type SearchIssueReport = {
  kind: 'search';
  query: string;
  intent: string;
  link: string;
  expected: string;
  mode: string;
  results: ReadonlyArray<string>;
};

export type IssueReport = ImportIssueReport | SearchIssueReport;
