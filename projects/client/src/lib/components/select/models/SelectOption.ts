export type SelectOption = {
  label: string;
  value: string;
  /* Multi-select only: when false the option cannot be excluded (no toggle). */
  excludable?: boolean;
};
