export type DatePickerProps = {
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  label: string;
  onChange: (date?: Date) => void;
  disabled?: boolean;
  required?: boolean;
};
