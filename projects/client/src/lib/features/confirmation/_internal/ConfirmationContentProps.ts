import type { ConfirmationParams } from '../models/ConfirmationParams.ts';
import type { ConfirmationType } from '../models/ConfirmationType.ts';

export type ConfirmationContentProps = {
  params: ConfirmationParams<ConfirmationType>;
};
