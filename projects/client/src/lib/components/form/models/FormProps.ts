export type FormProps = {
  onSubmit: () => void;
  onCancel: () => void;
  disabled: boolean;
  isCancelDisabled?: boolean;
  confirmButtonText: string;
  confirmButtonLabel: string;
  inlineActions?: boolean;
  /** Takes over the submit gate from native validity, for a rule the inputs
   * do not carry themselves. */
  isValid?: boolean;
} & ChildrenProps;
