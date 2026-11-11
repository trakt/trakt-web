import { buildImportIssue } from './buildImportIssue.ts';
import { buildSearchIssue } from './buildSearchIssue.ts';
import type { GitHubIssue } from './GitHubIssue.ts';
import type { ReportSubmission } from './ReportSubmission.ts';
import { toStorageName } from './toStorageName.ts';

type StoredFile = {
  key: string;
  file: File;
};

type ReportRecord = {
  storagePrefix: string;
  metaKey: string;
  files: ReadonlyArray<StoredFile>;
  meta: Record<string, unknown>;
  issue: GitHubIssue;
};

const META_NAME = 'report.json';

const toAttachmentName = (name: string): string => {
  const storageName = toStorageName(name);
  return storageName === META_NAME ? `upload-${storageName}` : storageName;
};

type ToReportRecordParams = {
  report: ReportSubmission;
  reportId: string;
  createdAt: string;
};

function toImportRecord({
  report,
  reportId,
  createdAt,
}: ToReportRecordParams & {
  report: Extract<ReportSubmission, { kind: 'import' }>;
}): ReportRecord {
  const storagePrefix = `${report.source}/${reportId}`;
  const reportedFiles = report.files.map((file) => ({
    name: toAttachmentName(file.name),
    size: file.size,
  }));
  const { files, ...rest } = report;

  return {
    storagePrefix,
    metaKey: `${storagePrefix}/${META_NAME}`,
    files: files.map((file) => ({
      key: `${storagePrefix}/${toAttachmentName(file.name)}`,
      file,
    })),
    meta: { reportId, ...rest, files: reportedFiles, createdAt },
    issue: buildImportIssue({
      ...rest,
      reportId,
      files: reportedFiles,
      storagePrefix,
    }),
  };
}

function toSearchRecord({
  report,
  reportId,
  createdAt,
}: ToReportRecordParams & {
  report: Extract<ReportSubmission, { kind: 'search' }>;
}): ReportRecord {
  const storagePrefix = `search/${reportId}`;

  return {
    storagePrefix,
    metaKey: `${storagePrefix}/${META_NAME}`,
    files: [],
    meta: { reportId, ...report, createdAt },
    issue: buildSearchIssue({ ...report, reportId, storagePrefix }),
  };
}

export function toReportRecord(params: ToReportRecordParams): ReportRecord {
  const { report } = params;
  switch (report.kind) {
    case 'import':
      return toImportRecord({ ...params, report });
    case 'search':
      return toSearchRecord({ ...params, report });
  }
}
