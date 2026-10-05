export type ServerSyncStatus =
  | { kind: 'synced'; at: Date }
  | { kind: 'never' }
  | { kind: 'paused' }
  | { kind: 'unreachable' }
  | { kind: 'unauthorized' };
