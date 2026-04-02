import { describe, expect, it } from 'vitest';
import type { PulseGraphItem } from '../models/PulseGraphItem.ts';
import type { PulseStatItem } from '../models/PulseStatItem.ts';
import { pairStatRuns } from './pairStatRuns.ts';

function stat(key: string): PulseStatItem {
  return {
    type: 'stat',
    key,
    score: 0,
    rawValue: 0,
    value: '0',
    label: key,
    delta: null,
  };
}

function graph(key: string): PulseGraphItem {
  return {
    type: 'graph',
    key,
    kind: 'dailyBars',
    data: {} as PulseGraphItem['data'],
    score: 0,
  };
}

describe('pairStatRuns', () => {
  it('returns empty array for no items', () => {
    expect(pairStatRuns([])).toEqual([]);
  });

  it('passes through an already even stat run before a graph', () => {
    const items = [stat('s1'), stat('s2'), graph('g1')];
    expect(pairStatRuns(items).map((i) => i.key)).toEqual([
      's1',
      's2',
      'g1',
    ]);
  });

  it('defers the last stat when run before a graph is odd', () => {
    const items = [stat('s1'), stat('s2'), stat('s3'), graph('g1')];
    expect(pairStatRuns(items).map((i) => i.key)).toEqual([
      's1',
      's2',
      'g1',
      's3',
    ]);
  });

  it('handles a single stat before a graph', () => {
    const items = [stat('s1'), graph('g1')];
    expect(pairStatRuns(items).map((i) => i.key)).toEqual([
      'g1',
      's1',
    ]);
  });

  it('carries a deferred stat into the next run and counts it', () => {
    // s1 is deferred past g1; the next run sees [s1, s2] (even) before g2
    const items = [stat('s1'), graph('g1'), stat('s2'), graph('g2')];
    expect(pairStatRuns(items).map((i) => i.key)).toEqual([
      'g1',
      's1',
      's2',
      'g2',
    ]);
  });

  it('defers again when combined run with carried stat is still odd', () => {
    // deferred s3 + s4 (2, even) → flush before g2; no further deferral
    const items = [
      stat('s1'),
      stat('s2'),
      stat('s3'),
      graph('g1'),
      stat('s4'),
      graph('g2'),
    ];
    expect(pairStatRuns(items).map((i) => i.key)).toEqual([
      's1',
      's2',
      'g1',
      's3',
      's4',
      'g2',
    ]);
  });

  it('leaves trailing stats unchanged at the end', () => {
    const items = [stat('s1'), stat('s2'), stat('s3')];
    expect(pairStatRuns(items).map((i) => i.key)).toEqual([
      's1',
      's2',
      's3',
    ]);
  });

  it('passes through graphs only', () => {
    const items = [graph('g1'), graph('g2')];
    expect(pairStatRuns(items).map((i) => i.key)).toEqual(['g1', 'g2']);
  });

  it('handles the example: graph -> stat×6 -> graph stays unchanged', () => {
    const items = [
      graph('g1'),
      stat('s1'),
      stat('s2'),
      stat('s3'),
      stat('s4'),
      stat('s5'),
      stat('s6'),
      graph('g2'),
    ];
    expect(pairStatRuns(items).map((i) => i.key)).toEqual([
      'g1',
      's1',
      's2',
      's3',
      's4',
      's5',
      's6',
      'g2',
    ]);
  });
});
