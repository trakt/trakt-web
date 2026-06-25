import { BehaviorSubject } from 'rxjs';
import type { ConfirmationOperation } from '../models/ConfirmationOperation.ts';

export type ConfirmationRequest = {
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message: string | Nil;
  detail?: string;
  buttonText: string;
  cancelText?: string;
  operation: ConfirmationOperation;
};

export type ConfirmationContext = {
  showConfirmation: (request: ConfirmationRequest) => void;
  hideConfirmation: () => void;
  activeConfirmation: BehaviorSubject<ConfirmationRequest | Nil>;
};
