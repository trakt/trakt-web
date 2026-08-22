export type ExportGateResult =
  | { outcome: 'proceed' }
  | { outcome: 'aborted' }
  | { outcome: 'failed'; error: string }
  | { outcome: 'partial'; failed: number; total: number };
