import { error as printError } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import { json, type RequestHandler } from '@sveltejs/kit';
import { parseReportForm } from './_internal/parseReportForm.ts';
import { postGitHubIssue } from './_internal/postGitHubIssue.ts';
import { toReportRecord } from './_internal/toReportRecord.ts';
import { validateReport } from './_internal/validateReport.ts';

export const POST: RequestHandler = async ({ request, locals, platform }) => {
  if (!locals.oidcAuth?.token) {
    return new Response(null, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const report = form ? parseReportForm(form) : null;
  if (!report) {
    return new Response(null, { status: 400 });
  }

  const validation = validateReport(report);
  if (!validation.ok) {
    return json({ ok: false, reason: validation.reason }, { status: 400 });
  }

  // No platform bindings in local dev — short-circuit so the UI stays testable.
  if (IS_DEV || !platform?.env?.R2_IMPORT_REPORTS) {
    return json({ ok: true });
  }

  const bucket = platform.env.R2_IMPORT_REPORTS;
  const record = toReportRecord({
    report,
    reportId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });

  try {
    await Promise.all(
      record.files.map(async ({ key, file }) =>
        bucket.put(key, await file.arrayBuffer(), {
          httpMetadata: {
            contentType: file.type || 'application/octet-stream',
          },
        }),
      ),
    );

    await bucket.put(record.metaKey, JSON.stringify(record.meta, null, 2), {
      httpMetadata: { contentType: 'application/json' },
    });
  } catch (e) {
    printError('Failed to store report in R2:', e);
    return json({ ok: false }, { status: 500 });
  }

  try {
    const response = await postGitHubIssue({
      repo: platform.env.IMPORT_REPORTS_REPO,
      token: platform.env.IMPORT_REPORTS_TOKEN,
      issue: record.issue,
    });

    if (!response.ok) {
      // Files are already in R2 keyed by reportId, so the report isn't lost.
      printError('Failed to create report issue:', response.status);
      return json({ ok: false }, { status: 502 });
    }
  } catch (e) {
    printError('Failed to create report issue:', e);
    return json({ ok: false }, { status: 502 });
  }

  return json({ ok: true });
};
