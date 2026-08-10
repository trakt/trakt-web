export type SyncLoadErrorProps = {
  message?: string;
  hint?: string;
  variant?: 'card' | 'plain';
  onRetry?: () => void;
};
