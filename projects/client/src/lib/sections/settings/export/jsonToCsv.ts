type CsvCell = string | number | boolean | null;
type CsvRow = Record<string, CsvCell>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toJsonCell(value: unknown): string {
  return JSON.stringify(value) ?? '';
}

function toCsvCell(value: unknown): CsvCell {
  if (value == null) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value;

  return toJsonCell(value);
}

function flattenRecord(
  record: Record<string, unknown>,
  parentKey = '',
): CsvRow {
  return Object.entries(record).reduce<CsvRow>((row, [key, value]) => {
    const field = parentKey ? `${parentKey}.${key}` : key;
    if (!isRecord(value)) return { ...row, [field]: toCsvCell(value) };

    const nestedRow = flattenRecord(value, field);
    if (Object.keys(nestedRow).length === 0) {
      return { ...row, [field]: toJsonCell(value) };
    }

    return { ...row, ...nestedRow };
  }, {});
}

function toCsvRow(value: unknown): CsvRow {
  if (!isRecord(value)) return { value: toCsvCell(value) };

  const row = flattenRecord(value);
  if (Object.keys(row).length > 0) return row;

  return { value: toJsonCell(value) };
}

function collectFields(rows: ReadonlyArray<CsvRow>): string[] {
  return rows.reduce<string[]>((fields, row) => {
    const newFields = Object.keys(row).filter((field) =>
      !fields.includes(field)
    );

    return [...fields, ...newFields];
  }, []);
}

export async function jsonToCsv(json: unknown): Promise<string> {
  if (isRecord(json) && Object.keys(json).length === 0) return '';

  const rows = Array.isArray(json) ? json.map(toCsvRow) : [toCsvRow(json)];
  const fields = collectFields(rows);
  if (fields.length === 0) return '';

  const Papa = await import('papaparse');
  return Papa.default.unparse(rows, {
    columns: fields,
    escapeFormulae: true,
    header: true,
    newline: '\r\n',
  });
}
