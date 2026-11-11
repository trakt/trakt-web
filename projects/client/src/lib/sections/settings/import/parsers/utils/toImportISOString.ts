const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ZONELESS_DATETIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/;

function toUtcDateString(value: string): string {
  if (DATE_ONLY_PATTERN.test(value)) return `${value}T12:00:00Z`;
  if (ZONELESS_DATETIME_PATTERN.test(value)) {
    return `${value.replace(' ', 'T')}Z`;
  }
  return value;
}

export function toImportISOString(value?: string): string | undefined {
  if (!value) return undefined;

  const date = new Date(toUtcDateString(value));
  return isNaN(date.getTime()) ? undefined : date.toISOString();
}
