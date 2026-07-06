type ReportedFile = {
  name: string;
  size: number;
};

type BuildReportIssueInput = {
  reportId: string;
  source: string;
  sourceName: string;
  userId: string;
  username: string;
  message: string;
  files: ReadonlyArray<ReportedFile>;
  storagePrefix: string;
};

type GitHubIssue = {
  title: string;
  body: string;
  labels: ReadonlyArray<string>;
};

const BASE_LABEL = 'import-report';

const toFileLine = (file: ReportedFile): string =>
  `- \`${file.name}\` (${file.size} bytes)`;

/**
 * Assembles the GitHub issue payload for an importer issue report.
 *
 * Carries the importer `source` (id + display name) so a shared reports repo
 * stays sortable once other importers gain FAQs. Deliberately carries the
 * reporter's Trakt **id + username** but never their email: the id is a stable
 * lookup key, and keeping PII out of tickets is preferable even in a private
 * repo.
 */
export function buildReportIssue(
  {
    reportId,
    source,
    sourceName,
    userId,
    username,
    message,
    files,
    storagePrefix,
  }: BuildReportIssueInput,
): GitHubIssue {
  const fileLines = files.length > 0
    ? files.map(toFileLine).join('\n')
    : '- (none)';

  const body = [
    `**Source:** ${sourceName} (${source})`,
    `**User:** @${username} (id: ${userId})`,
    `**Report ID:** ${reportId}`,
    `**Storage:** \`${storagePrefix}/\``,
    '',
    '**Uploaded files:**',
    fileLines,
    '',
    '---',
    '',
    message,
  ].join('\n');

  return {
    title: `${sourceName} import — @${username}`,
    body,
    labels: [BASE_LABEL, source],
  };
}
