import type { Editor } from '@tiptap/core';
import type { Component } from 'svelte';
import type { ToolbarState } from './ToolbarState.ts';

export type ToolbarAction = {
  key: Exclude<keyof ToolbarState, 'link'>;
  label: string;
  icon: Component;
  run: (editor: Editor) => void;
};
