import type { RawExportFormat } from './RawExportFormat.ts';
import { jsonToCsv } from './jsonToCsv.ts';

const CSV_BYTE_ORDER_MARK = '\uFEFF';

export async function toRawExportFileContent(
  data: unknown,
  format: RawExportFormat,
): Promise<string> {
  if (format === 'csv') {
    const csv = await jsonToCsv(data);
    return csv ? `${CSV_BYTE_ORDER_MARK}${csv}` : '';
  }

  return JSON.stringify(data, null, 2) ?? '';
}
