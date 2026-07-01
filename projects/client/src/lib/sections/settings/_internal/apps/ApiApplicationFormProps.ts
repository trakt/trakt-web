import type { ApiApplicationFormValues } from './ApiApplicationFormValues.ts';

export type ApiApplicationFormProps = {
  initial?: {
    name: string;
    description: string;
    redirectUriText: string;
    originsText: string;
  };
  isBusy?: boolean;
  confirmButtonText: string;
  confirmButtonLabel: string;
  onSubmit: (values: ApiApplicationFormValues) => void;
  onCancel: () => void;
};
