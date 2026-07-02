import type { ApiApplicationFormProps } from './ApiApplicationFormProps.ts';

export type ApiApplicationFormSectionProps =
  & {
    title: string;
    description: string;
    crumbHref: string;
    crumbLabel: string;
  }
  & Pick<
    ApiApplicationFormProps,
    | 'initial'
    | 'isBusy'
    | 'confirmButtonText'
    | 'confirmButtonLabel'
    | 'onSubmit'
    | 'onCancel'
  >;
