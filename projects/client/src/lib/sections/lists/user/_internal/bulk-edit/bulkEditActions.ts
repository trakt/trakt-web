import type { Component } from 'svelte';
import BulkDeleteAction from './BulkDeleteAction.svelte';
import type { BulkEditActionProps } from './BulkEditActionProps.ts';

type BulkEditAction = {
  key: string;
  component: Component<BulkEditActionProps>;
};

/**
 * Actions offered in the bulk-edit header, in render order. Adding a new bulk
 * operation (e.g. move to another list) is a matter of implementing
 * `BulkEditActionProps` and registering the component here.
 */
export const bulkEditActions: ReadonlyArray<BulkEditAction> = [
  { key: 'delete', component: BulkDeleteAction },
];
