import type { GitHubIssue } from './GitHubIssue.ts';

type BuildSearchIssueInput = {
  reportId: string;
  userId: string;
  username: string;
  query: string;
  intent: string;
  expected: string;
  mode: string;
  results: ReadonlyArray<string>;
  storagePrefix: string;
};

const BASE_LABEL = 'search-report';

const toResultLines = (results: ReadonlyArray<string>): string =>
  results.length > 0
    ? results.map((result, index) => `${index + 1}. ${result}`).join('\n')
    : '- (no results)';

export function buildSearchIssue({
  reportId,
  userId,
  username,
  query,
  intent,
  expected,
  mode,
  results,
  storagePrefix,
}: BuildSearchIssueInput): GitHubIssue {
  const body = [
    `**Search text:** \`${query.replaceAll('`', "'")}\``,
    `**Looking for:** ${intent}`,
    `**Mode:** ${mode}`,
    `**User:** @${username} (id: ${userId})`,
    `**Report ID:** ${reportId}`,
    `**Storage:** \`${storagePrefix}/\``,
    '',
    '**Results shown:**',
    toResultLines(results),
    '',
    '---',
    '',
    '**Expected to find:**',
    '',
    expected,
  ].join('\n');

  return {
    title: `Search: "${query.slice(0, 80)}" - @${username}`,
    body,
    labels: [BASE_LABEL],
  };
}
