export type SearchFieldProps = {
  variant?: 'default' | 'embedded';
  placeholder: string;
  /** Accessible name; falls back to the placeholder when omitted. */
  label?: string;
  defaultValue?: string;
  /** Shows the animated progress bar under the field. */
  isLoading?: boolean;
  /** Focus the field once mounted, e.g. when it is revealed by a user action. */
  autofocus?: boolean;
  inputElement?: HTMLInputElement;
  oninput?: (event: Event) => void;
  onclick?: (event: MouseEvent) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  onclickoutside?: () => void;
};
