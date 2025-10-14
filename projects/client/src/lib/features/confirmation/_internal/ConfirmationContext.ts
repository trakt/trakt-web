import { type Writable } from 'svelte/store';
import type { ConfirmationOperation } from '../models/ConfirmationOperation.ts';

export type ConfirmationRequest = {
  onConfirm: () => void;
  message: string | Nil;
  buttonText: string;
  operation: ConfirmationOperation;
};

export type ConfirmationContext = {
  showConfirmation: (request: ConfirmationRequest) => void;
  hideConfirmation: () => void;
  activeConfirmation: Writable<ConfirmationRequest | Nil>;
};
