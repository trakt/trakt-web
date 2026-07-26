/**
 * A single interactive control rendered next to an action-confirmation
 * message - e.g. an "Undo" or "Change list" button.
 *
 * `onAction` is fired on click; the host dismisses the toast around it, so
 * handlers only need to perform the action itself (re-add, open a drawer, …).
 */
export type ActionToastAction = {
  /** Visible label, e.g. "Undo" or "Change list". */
  text: string;
  /** Accessible name for screen readers (never rely on `text` alone). */
  label: string;
  /**
   * `outline` renders a purple outlined pill (the confirmation-toast default);
   * `button` renders a filled call-to-action.
   */
  style?: 'outline' | 'button';
  onAction: () => void | Promise<void>;
};

/**
 * A queued confirmation toast. `id` is assigned by the store so a late
 * auto-dismiss can target the exact toast it belongs to and never clobber a
 * newer one that has since replaced it.
 */
export type ActionToast = {
  id: string;
  message: string;
  title?: string;
  action?: ActionToastAction;
  variant?: 'default' | 'error';
  durationMs?: number;
};
