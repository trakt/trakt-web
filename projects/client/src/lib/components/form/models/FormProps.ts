export type FormProps = {
  onSubmit: () => void;
  onCancel: () => void;
  disabled: boolean;
  isCancelDisabled?: boolean;
  confirmButtonText: string;
  confirmButtonLabel: string;
  inlineActions?: boolean;
  /** Extra submit gate, on top of native validity, for a rule the inputs do
   * not carry themselves. */
  isValid?: boolean;
} & ChildrenProps;
