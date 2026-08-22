export type ExportGateState = {
  isExporting: boolean;
  processed: number;
  total: number;
  page: number;
  statusText: string;
  hasFailed: boolean;
};
