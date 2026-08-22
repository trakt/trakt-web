import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ExportOptions } from './models/ExportOptions.ts';
import type { ExportProgress } from './models/ExportProgress.ts';
import type { ExportStatus } from './models/ExportStatus.ts';
import { runExportGate } from './runExportGate.ts';
import { runRawExport } from './runRawExport.ts';

vi.mock('./runRawExport.ts', () => ({ runRawExport: vi.fn() }));

const USER = { slug: 'mega-collector', isVip: false };

function stubExport(behaviour: (options: ExportOptions) => void) {
  vi.mocked(runRawExport).mockImplementation((options) => {
    behaviour(options);
    return Promise.resolve();
  });
}

function gateFor(signal = new AbortController().signal) {
  const statuses: Array<ExportStatus> = [];
  const progresses: Array<ExportProgress> = [];

  const result = runExportGate({
    user: USER,
    signal,
    onStatus: (status) => statuses.push(status),
    onProgress: (progress) => progresses.push(progress),
  });

  return { result, statuses, progresses };
}

describe('runExportGate', () => {
  beforeEach(() => {
    vi.mocked(runRawExport).mockReset();
  });

  it('should proceed when the export completes cleanly', async () => {
    stubExport(({ onProgress, onStatus, onComplete }) => {
      onProgress({ processed: 48, total: 48 });
      onStatus({ type: 'complete' });
      onComplete();
    });

    expect(await gateFor().result).to.deep.equal({ outcome: 'proceed' });
  });

  it('should forward status and progress to the caller', async () => {
    stubExport(({ onProgress, onStatus }) => {
      onProgress({ processed: 1, total: 12 });
      onStatus({ type: 'fetch', item: 'ratings-shows' });
    });

    const { result, statuses, progresses } = gateFor();
    await result;

    expect(progresses).to.deep.equal([{ processed: 1, total: 12 }]);
    expect(statuses).to.deep.equal([{ type: 'fetch', item: 'ratings-shows' }]);
  });

  it('should report the counts when sections failed to export', async () => {
    stubExport(({ onProgress, onStatus }) => {
      onProgress({ processed: 48, total: 48 });
      onStatus({ type: 'partial', failed: 3 });
    });

    expect(await gateFor().result).to.deep.equal({
      outcome: 'partial',
      failed: 3,
      total: 48,
    });
  });

  it('should report a failed export', async () => {
    stubExport(({ onError }) => onError(new Error('boom')));

    expect(await gateFor().result).to.deep.equal({ outcome: 'failed' });
  });

  it('should report an aborted export ahead of any error it raised', async () => {
    const controller = new AbortController();
    stubExport(({ onError }) => {
      controller.abort();
      onError(new Error('aborted'));
    });

    expect(await gateFor(controller.signal).result).to.deep.equal({
      outcome: 'aborted',
    });
  });

  it('should report an abort ahead of a partial result', async () => {
    const controller = new AbortController();
    stubExport(({ onStatus }) => {
      onStatus({ type: 'partial', failed: 2 });
      controller.abort();
    });

    expect(await gateFor(controller.signal).result).to.deep.equal({
      outcome: 'aborted',
    });
  });
});
