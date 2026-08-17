import type { Component } from 'svelte';
import { ConfirmationType } from '../models/ConfirmationType.ts';
import type { ConfirmationContentProps } from './ConfirmationContentProps.ts';
import SetCoverImagePreview from './SetCoverImagePreview.svelte';

export const confirmationContent: Partial<
  Record<ConfirmationType, Component<ConfirmationContentProps>>
> = {
  [ConfirmationType.SetCoverImage]: SetCoverImagePreview,
};
