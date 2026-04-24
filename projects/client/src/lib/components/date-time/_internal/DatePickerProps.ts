export type DatePickerProps = {
  value?: Date;
  maxDate?: Date;
  label: string;
  onChange: (date?: Date) => void;
  disabled?: boolean;
};
