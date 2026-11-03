import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';
import { describe, expect, it } from 'vitest';
import { toHeaderProviders } from './toHeaderProviders.ts';

const streaming = (source: string) =>
  ({ source, type: 'streaming', link: `https://example.com/${source}` }) as
    StreamingServiceOption;

const streamOnWith = (sources: string[]): StreamOn =>
  ({
    services: {
      streaming: sources.map(streaming),
      free: [],
      onDemand: [],
    },
  }) as unknown as StreamOn;

describe('util: toHeaderProviders', () => {
  it('should fold the plans of one service into a single row', () => {
    const providers = toHeaderProviders(
      streamOnWith(['netflix', 'netflix_standard_with_ads', 'hbo_max']),
    );

    expect(providers.map(({ service, planCount }) => [service.source, planCount]))
      .toEqual([
        ['netflix', 2],
        ['hbo_max', 1],
      ]);
  });

  it('should lead with the base plan even when a variant comes first', () => {
    const [netflix] = toHeaderProviders(
      streamOnWith(['netflix_standard_with_ads', 'netflix']),
    );

    expect(netflix?.service.source).toBe('netflix');
    expect(netflix?.planCount).toBe(2);
  });

  it('should keep channels sold through another store apart', () => {
    const providers = toHeaderProviders(
      streamOnWith(['amazon_prime_video', 'mubi_amazon_channel']),
    );

    expect(providers).toHaveLength(2);
  });

  it('should fold before the limit, so every row is a distinct service', () => {
    const providers = toHeaderProviders(
      streamOnWith([
        'netflix',
        'netflix_standard_with_ads',
        'amazon_prime_video',
        'amazon_prime_video_with_ads',
        'hbo_max',
      ]),
    );

    expect(providers.map(({ service }) => service.source)).toEqual([
      'netflix',
      'amazon_prime_video',
      'hbo_max',
    ]);
  });
});
