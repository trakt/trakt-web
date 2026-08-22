import type { ConfirmationChallenge } from './ConfirmationChallenge.ts';
import type { ConfirmationPreflight } from './ConfirmationPreflight.ts';
import type { ConfirmationOperation } from './ConfirmationOperation.ts';

export type Confirmation = {
  title: string;
  message: string | Nil;
  detail?: string;
  buttonText: string;
  cancelText?: string;
  operation: ConfirmationOperation;
  challenge?: ConfirmationChallenge;
  preflight?: ConfirmationPreflight;
};
