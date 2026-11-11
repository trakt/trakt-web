import { isReputableLink } from '$lib/features/issue-report/isReputableLink.ts';

const LIMITS = {
  maxQueryLength: 200,
  maxIntentLength: 500,
  maxLinkLength: 500,
  maxExpectedLength: 5_000,
  maxResults: 20,
  maxResultLength: 300,
} as const;

type ValidationFailure =
  | 'query-required'
  | 'query-too-long'
  | 'intent-required'
  | 'intent-too-long'
  | 'link-required'
  | 'link-too-long'
  | 'link-not-reputable'
  | 'expected-required'
  | 'expected-too-long'
  | 'too-many-results'
  | 'result-too-long';

type ValidationResult = { ok: true } | { ok: false; reason: ValidationFailure };

type SearchReportInput = {
  query: string;
  intent: string;
  link: string;
  expected: string;
  results: ReadonlyArray<string>;
};

export function validateSearchReport({
  query,
  intent,
  link,
  expected,
  results,
}: SearchReportInput): ValidationResult {
  if (query.trim().length === 0) {
    return { ok: false, reason: 'query-required' };
  }
  if (query.length > LIMITS.maxQueryLength) {
    return { ok: false, reason: 'query-too-long' };
  }

  if (intent.trim().length === 0) {
    return { ok: false, reason: 'intent-required' };
  }
  if (intent.length > LIMITS.maxIntentLength) {
    return { ok: false, reason: 'intent-too-long' };
  }

  if (link.trim().length === 0) {
    return { ok: false, reason: 'link-required' };
  }
  if (link.length > LIMITS.maxLinkLength) {
    return { ok: false, reason: 'link-too-long' };
  }
  if (!isReputableLink(link)) {
    return { ok: false, reason: 'link-not-reputable' };
  }

  if (expected.trim().length === 0) {
    return { ok: false, reason: 'expected-required' };
  }
  if (expected.length > LIMITS.maxExpectedLength) {
    return { ok: false, reason: 'expected-too-long' };
  }

  if (results.length > LIMITS.maxResults) {
    return { ok: false, reason: 'too-many-results' };
  }

  const hasLongResult = results.some(
    (result) => result.length > LIMITS.maxResultLength,
  );
  if (hasLongResult) return { ok: false, reason: 'result-too-long' };

  return { ok: true };
}
