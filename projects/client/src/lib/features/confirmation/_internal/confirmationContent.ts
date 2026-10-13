import type { Component } from 'svelte';
import { ConfirmationType } from '../models/ConfirmationType.ts';
import type { ConfirmationContentProps } from './ConfirmationContentProps.ts';
import DeleteAccountStats from './DeleteAccountStats.svelte';
import SetCoverImagePreview from './SetCoverImagePreview.svelte';

export const confirmationContent: Partial<
  Record<ConfirmationType, Component<ConfirmationContentProps>>
> = {
  [ConfirmationType.DeleteAccount]: DeleteAccountStats,
  [ConfirmationType.SetCoverImage]: SetCoverImagePreview,
};
