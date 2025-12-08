export type FormInputProps = {
  autofocus?: boolean;
  onChange: (value: string) => void;
  value?: string;
  disabled: boolean;
  placeholder: string;
  validation?: {
    errorText: string;
    isValid: (value: string) => boolean;
  };
};
