export type FormProps = {
  onSubmit: () => void;
  onCancel: () => void;
  disabled: boolean;
  isCancelDisabled?: boolean;
  confirmButtonText: string;
  confirmButtonLabel: string;
} & ChildrenProps;
