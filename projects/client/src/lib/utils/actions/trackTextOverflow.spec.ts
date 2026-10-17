import { afterEach, describe, expect, it } from 'vitest';
import { writable } from '$lib/utils/store/WritableSubject.ts';
import { trackTextOverflow } from './trackTextOverflow.ts';

type Log = string[];

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function createNode({
  id,
  overflows,
  log,
}: {
  id: string;
  overflows: boolean;
  log: Log;
}) {
  const node = document.createElement('p');
  Object.defineProperty(node, 'scrollWidth', {
    get: () => {
      log.push(`read:${id}`);
      return overflows ? 200 : 100;
    },
  });
  Object.defineProperty(node, 'clientWidth', { get: () => 100 });
  Object.defineProperty(node, 'scrollHeight', { get: () => 20 });
  Object.defineProperty(node, 'clientHeight', { get: () => 20 });
  return node;
}

function track({
  id,
  overflows,
  log,
}: {
  id: string;
  overflows: boolean;
  log: Log;
}) {
  const node = createNode({ id, overflows, log });
  const isTruncated = writable(false);
  isTruncated.subscribe((value) => log.push(`write:${id}:${value}`));
  const action = trackTextOverflow(node, isTruncated);
  return { node, isTruncated, action };
}

describe('action: trackTextOverflow', () => {
  const destroyers: Array<() => void> = [];

  afterEach(() => {
    destroyers.splice(0).forEach((destroy) => destroy());
  });

  it('should not read layout while mounting', () => {
    const log: Log = [];
    const { action } = track({ id: 'a', overflows: true, log });
    destroyers.push(action.destroy);

    expect(log.filter((entry) => entry.startsWith('read'))).toEqual([]);
  });

  it('should flag truncated text after the next frame', async () => {
    const log: Log = [];
    const truncated = track({ id: 'a', overflows: true, log });
    const fitting = track({ id: 'b', overflows: false, log });
    destroyers.push(truncated.action.destroy, fitting.action.destroy);

    await nextFrame();

    expect(truncated.isTruncated.getValue()).toBe(true);
    expect(fitting.isTruncated.getValue()).toBe(false);
  });

  it('should read every node before writing any store', async () => {
    const log: Log = [];
    const tracked = ['a', 'b', 'c'].map((id) =>
      track({ id, overflows: true, log }),
    );
    destroyers.push(...tracked.map(({ action }) => action.destroy));
    log.length = 0;

    await nextFrame();

    expect(log).toEqual([
      'read:a',
      'read:b',
      'read:c',
      'write:a:true',
      'write:b:true',
      'write:c:true',
    ]);
  });

  it('should measure again on pointerenter', async () => {
    const log: Log = [];
    const { node, isTruncated, action } = track({
      id: 'a',
      overflows: true,
      log,
    });
    destroyers.push(action.destroy);
    await nextFrame();
    isTruncated.set(false);

    node.dispatchEvent(new Event('pointerenter'));

    expect(isTruncated.getValue()).toBe(true);
  });

  it('should skip nodes destroyed before the next frame', async () => {
    const log: Log = [];
    const { isTruncated, action } = track({ id: 'a', overflows: true, log });
    action.destroy();

    await nextFrame();

    expect(isTruncated.getValue()).toBe(false);
    expect(log.filter((entry) => entry.startsWith('read'))).toEqual([]);
  });
});
