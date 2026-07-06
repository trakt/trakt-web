import { error as printError } from '$lib/utils/console/print.ts';
import { IS_DEV } from '$lib/utils/env/index.ts';
import { json, type RequestHandler } from '@sveltejs/kit';
import { buildReportIssue } from './_internal/buildReportIssue.ts';
import { validateTvTimeReport } from './_internal/validateTvTimeReport.ts';

const GITHUB_API = 'https://api.github.com';

/** Strips path segments + unsafe chars so a filename can't escape the prefix. */
function sanitizeName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  return base.replace(/[^\w.\- ]+/g, '_').slice(0, 128) || 'file';
}

/** Normalises an importer source id into a safe key/label segment. */
function sanitizeSource(source: string): string {
  return source.replace(/[^a-z0-9-]+/gi, '').toLowerCase().slice(0, 32) ||
    'unknown';
}

export const POST: RequestHandler = async ({ request, locals, platform }) => {
  if (!locals.oidcAuth?.token) {
    return new Response(null, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return new Response(null, { status: 400 });
  }

  const message = (form.get('message') ?? '').toString();
  const userId = (form.get('userId') ?? '').toString();
  const username = (form.get('username') ?? '').toString();
  const source = sanitizeSource((form.get('source') ?? '').toString());
  const sourceName = (form.get('sourceName') ?? '').toString() || source;
  const files = form.getAll('files').filter((entry): entry is File =>
    entry instanceof File
  );

  const validation = validateTvTimeReport({ message, files });
  if (!validation.ok) {
    return json({ ok: false, reason: validation.reason }, { status: 400 });
  }

  const reportId = crypto.randomUUID();
  const prefix = `${source}/${reportId}`;

  // No platform bindings in local dev — short-circuit so the UI stays testable.
  if (IS_DEV || !platform?.env?.R2_IMPORT_REPORTS) {
    return json({ ok: true });
  }

  const reportedFiles = files.map((file) => ({
    name: file.name,
    size: file.size,
  }));

  try {
    await Promise.all(
      files.map(async (file) =>
        platform.env.R2_IMPORT_REPORTS.put(
          `${prefix}/${sanitizeName(file.name)}`,
          await file.arrayBuffer(),
          {
            httpMetadata: {
              contentType: file.type || 'application/octet-stream',
            },
          },
        )
      ),
    );

    const reportMeta = {
      reportId,
      source,
      sourceName,
      userId,
      username,
      message,
      files: reportedFiles,
      createdAt: new Date().toISOString(),
    };

    await platform.env.R2_IMPORT_REPORTS.put(
      `${prefix}/report.json`,
      JSON.stringify(reportMeta, null, 2),
      { httpMetadata: { contentType: 'application/json' } },
    );
  } catch (e) {
    printError('Failed to store TV Time report in R2:', e);
    return json({ ok: false }, { status: 500 });
  }

  try {
    const issue = buildReportIssue({
      reportId,
      source,
      sourceName,
      userId,
      username,
      message,
      files: reportedFiles,
      storagePrefix: prefix,
    });

    const response = await fetch(
      `${GITHUB_API}/repos/${platform.env.IMPORT_REPORTS_REPO}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${platform.env.IMPORT_REPORTS_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'trakt-web',
        },
        body: JSON.stringify(issue),
      },
    );

    if (!response.ok) {
      // Files are already in R2 keyed by reportId, so the report isn't lost.
      printError('Failed to create TV Time report issue:', response.status);
      return json({ ok: false }, { status: 502 });
    }
  } catch (e) {
    printError('Failed to create TV Time report issue:', e);
    return json({ ok: false }, { status: 502 });
  }

  return json({ ok: true });
};
