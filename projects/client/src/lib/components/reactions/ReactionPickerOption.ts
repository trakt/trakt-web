export type ReactionPickerOption<T extends string = string> = {
  id: T;
  label: string;
  keywords: ReadonlyArray<string>;
  code: string;
};
