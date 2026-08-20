export type ActionToastAction = {
  text: string;
  label: string;
  onAction: () => void | Promise<void>;
};

export type ActionToast = {
  id: string;
  message: string;
  title?: string;
  action?: ActionToastAction;
  variant?: 'default' | 'error';
  durationMs?: number;
};
