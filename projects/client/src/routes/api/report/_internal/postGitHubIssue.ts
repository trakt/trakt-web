import type { GitHubIssue } from './GitHubIssue.ts';

const GITHUB_API = 'https://api.github.com';

type PostGitHubIssueParams = {
  repo: string;
  token: string;
  issue: GitHubIssue;
};

export function postGitHubIssue({
  repo,
  token,
  issue,
}: PostGitHubIssueParams): Promise<Response> {
  return fetch(`${GITHUB_API}/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'trakt-web',
    },
    body: JSON.stringify(issue),
  });
}
