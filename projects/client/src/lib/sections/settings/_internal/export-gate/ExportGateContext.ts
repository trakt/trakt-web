import type { ExportUser } from '../../export/models/ExportUser.ts';
import type { ExportOptions } from '../../export/models/ExportOptions.ts';

export type ExportGateContext = {
  run: (
    options: {
      shouldExport: boolean;
      user: ExportUser | Nil;
      exporter?: (options: ExportOptions) => Promise<void>;
    },
  ) => Promise<boolean>;
  stop: () => void;
};
