import { setContext } from 'svelte';
import type { ExportGateContext } from './ExportGateContext.ts';

export const EXPORT_GATE_CONTEXT_KEY = Symbol('export-gate');

export function createExportGateContext(context: ExportGateContext) {
  setContext(EXPORT_GATE_CONTEXT_KEY, context);
}
