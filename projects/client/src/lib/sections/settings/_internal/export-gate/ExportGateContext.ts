import type { ExportUser } from '../../export/models/ExportUser.ts';

export type ExportGateContext = {
  run: (
    options: { shouldExport: boolean; user: ExportUser | Nil },
  ) => Promise<boolean>;
  stop: () => void;
};
