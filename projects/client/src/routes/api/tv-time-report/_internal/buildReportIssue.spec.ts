import { describe, expect, it } from 'vitest';
import { buildReportIssue } from './buildReportIssue.ts';

const baseInput = {
  reportId: 'abc-123',
  source: 'tvtime',
  sourceName: 'TV Time',
  userId: '42',
  username: 'seferturan',
  message: 'Nothing imported from my GDPR export.',
  files: [{ name: 'tracking-prod-records.csv', size: 2048 }],
  storagePrefix: 'import-reports/tvtime/abc-123',
};

describe('util: buildReportIssue', () => {
  it('should title the issue with the source name and username', () => {
    const issue = buildReportIssue(baseInput);

    expect(issue.title).toBe('TV Time import — @seferturan');
  });

  it('should include the importer source in body and labels', () => {
    const issue = buildReportIssue(baseInput);

    expect(issue.body).toContain('TV Time (tvtime)');
    expect(issue.labels).toContain('tvtime');
  });

  it('should carry the user id and username in the body', () => {
    const issue = buildReportIssue(baseInput);

    expect(issue.body).toContain('@seferturan');
    expect(issue.body).toContain('id: 42');
  });

  it('should never include an email address', () => {
    const issue = buildReportIssue(baseInput);

    // @username is expected; an actual email (local@domain.tld) is not.
    expect(issue.body).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  });

  it('should list uploaded files and the storage prefix', () => {
    const issue = buildReportIssue(baseInput);

    expect(issue.body).toContain('tracking-prod-records.csv');
    expect(issue.body).toContain('import-reports/tvtime/abc-123/');
  });

  it('should include the report message', () => {
    const issue = buildReportIssue(baseInput);

    expect(issue.body).toContain('Nothing imported from my GDPR export.');
  });

  it('should tag the issue with the base import-report label', () => {
    const issue = buildReportIssue(baseInput);

    expect(issue.labels).toContain('import-report');
  });
});
