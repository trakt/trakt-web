const CHUNK_PATH = '_app/immutable/';

const JSON_ERROR_PATTERN = /\bJSON\b/;

type ErrorWithFileName = SyntaxError & { fileName?: unknown };

function toSource(error: ErrorWithFileName): string {
  const fileName = typeof error.fileName === 'string' ? error.fileName : '';
  return `${fileName}\n${error.stack ?? ''}`;
}

export function isChunkParseError(error: unknown): boolean {
  if (!(error instanceof SyntaxError)) return false;
  if (JSON_ERROR_PATTERN.test(error.message)) return false;

  return toSource(error).includes(CHUNK_PATH);
}
