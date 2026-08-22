import { getContext } from 'svelte';
import { EXPORT_GATE_CONTEXT_KEY } from './createExportGateContext.ts';
import type { ExportGateContext } from './ExportGateContext.ts';

export function useExportGate(): ExportGateContext {
  const context = getContext<ExportGateContext>(EXPORT_GATE_CONTEXT_KEY);

  if (!context) {
    throw new Error('useExportGate must be used within an ExportGateProvider');
  }

  return context;
}
