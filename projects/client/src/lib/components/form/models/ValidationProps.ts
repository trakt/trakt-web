export type ValidationProps<T = string> = {
  errorText: string;
  isValid: (value: T) => boolean;
};
