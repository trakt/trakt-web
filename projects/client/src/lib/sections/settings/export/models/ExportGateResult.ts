export type ExportGateResult =
  | { outcome: 'proceed' }
  | { outcome: 'aborted' }
  | { outcome: 'failed' }
  | { outcome: 'partial'; failed: number; total: number };
