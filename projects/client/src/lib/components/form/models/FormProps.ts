export type FormProps = {
  onSubmit: () => void;
  onCancel: () => void;
  disabled: boolean;
  confirmButtonText: string;
  confirmButtonLabel: string;
} & ChildrenProps;
