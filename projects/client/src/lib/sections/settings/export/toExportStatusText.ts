import * as m from '$lib/features/i18n/messages.ts';
import type { ExportStatus } from './models/ExportStatus.ts';

type ToExportStatusTextOptions = {
  status: ExportStatus;
  total: number;
};

export function toExportStatusText({
  status,
  total,
}: ToExportStatusTextOptions): string {
  switch (status.type) {
    case 'fetch':
      return m.text_export_status_fetching({ item: status.item });
    case 'zip':
      return m.text_export_status_zipping();
    case 'partial':
      return status.failed === 1
        ? m.text_export_status_partial_one({ total })
        : m.text_export_status_partial_other({ failed: status.failed, total });
    case 'complete':
      return m.text_export_status_complete();
  }
}
