import { BehaviorSubject } from 'rxjs';
import type { Confirmation } from '../models/Confirmation.ts';
import type { ConfirmationParams } from '../models/ConfirmationParams.ts';
import type { ConfirmationType } from '../models/ConfirmationType.ts';

export type ConfirmationRequest = Confirmation & {
  onConfirm: () => void;
  onCancel?: () => void;
  params: ConfirmationParams<ConfirmationType>;
};

export type ConfirmationContext = {
  showConfirmation: (request: ConfirmationRequest) => void;
  hideConfirmation: () => void;
  activeConfirmation: BehaviorSubject<ConfirmationRequest | Nil>;
};
