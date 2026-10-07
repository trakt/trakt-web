export type VipCancelLoss =
  | { kind: 'streaming'; services: ReadonlyArray<string> }
  | { kind: 'plex-scrobbling' }
  | { kind: 'plex-servers'; count: number };
