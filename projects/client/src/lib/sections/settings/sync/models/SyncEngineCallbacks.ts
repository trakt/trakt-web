export type SyncEngineCallbacks = {
  onProgress: (processed: number) => void;
  onError: (message: string) => void;
  onStart?: () => void;
  onComplete?: (success: boolean) => void;
};
