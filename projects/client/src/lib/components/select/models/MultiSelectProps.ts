type Value = {
  label: string;
  value: string;
};

export type MultiSelectProps = {
  options: ReadonlyArray<Value>;
  value?: string[];
  placeholder: string;
  disabled?: boolean;
  onChange: (values: string[]) => void;
};
