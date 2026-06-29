export type ApiApplicationFormValues = {
  name: string;
  description?: string;
  redirectUris: ReadonlyArray<string>;
  origins: ReadonlyArray<string>;
};
