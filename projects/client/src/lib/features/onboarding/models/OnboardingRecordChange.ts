export type OnboardingRecordChange =
  | { type: 'start'; stepIds: ReadonlyArray<string> }
  | { type: 'done'; stepId: string; source: 'action' | 'account' }
  | { type: 'skip'; stepId: string }
  | { type: 'unskip'; stepId: string }
  | { type: 'track'; stepId: string | null }
  | { type: 'complete' }
  | { type: 'retire' };
