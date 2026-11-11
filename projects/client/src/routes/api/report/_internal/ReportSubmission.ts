export type Reporter = {
  userId: string;
  username: string;
  isVip: boolean;
};

export type ImportReportSubmission = Reporter & {
  kind: 'import';
  source: string;
  sourceName: string;
  message: string;
  files: ReadonlyArray<File>;
};

export type SearchReportSubmission = Reporter & {
  kind: 'search';
  query: string;
  intent: string;
  link: string;
  expected: string;
  mode: string;
  results: ReadonlyArray<string>;
};

export type ReportSubmission = ImportReportSubmission | SearchReportSubmission;
