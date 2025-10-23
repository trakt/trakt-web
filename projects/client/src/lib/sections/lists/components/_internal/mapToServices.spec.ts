import type { StreamOn } from '$lib/requests/models/StreamOn.ts';
import type {
  StreamNow,
  StreamOnDemand,
} from '$lib/requests/models/StreamingServiceOptions.ts';
import { describe, expect, it } from 'vitest';
import { mapToServices } from './mapToServices.ts';

describe('mapToServices', () => {
  it('should return an empty array if streamOn is undefined', () => {
    expect(mapToServices(undefined)).toEqual([]);
  });

  it('should return an empty array if streamOn has no services', () => {
    const streamOn: StreamOn = {};
    expect(mapToServices(streamOn)).toEqual([]);
  });

  it('should map streaming services without preferred service', () => {
    const streamingService: StreamNow = {
      link: 'https://netflix.com',
      source: 'netflix',
      is4k: true,
      type: 'streaming',
    };

    const streamOn: StreamOn = {
      services: {
        streaming: [streamingService],
        onDemand: [],
      },
    };

    const result = mapToServices(streamOn);
    expect(result).toEqual([
      {
        ...streamingService,
        id: 'streaming-netflix',
      },
    ]);
  });

  it('should map on-demand services without preferred service', () => {
    const onDemandService: StreamOnDemand = {
      link: 'https://amazon.com',
      source: 'amazon',
      is4k: false,
      currency: 'usd',
      prices: { rent: 3.99 },
      type: 'on-demand',
    };

    const streamOn: StreamOn = {
      services: {
        streaming: [],
        onDemand: [onDemandService],
      },
    };

    const result = mapToServices(streamOn);
    expect(result).toEqual([
      {
        ...onDemandService,
        id: 'on-demand-amazon',
      },
    ]);
  });

  it('should prioritize preferred service at the beginning of the array', () => {
    const preferredService: StreamNow = {
      link: 'https://netflix.com',
      source: 'netflix',
      is4k: true,
      type: 'streaming',
    };

    const otherStreamingService: StreamNow = {
      link: 'https://hulu.com',
      source: 'hulu',
      is4k: false,
      type: 'streaming',
    };

    const onDemandService: StreamOnDemand = {
      link: 'https://amazon.com',
      source: 'amazon',
      is4k: false,
      currency: 'usd',
      prices: { purchase: 9.99 },
      type: 'on-demand',
    };

    const streamOn: StreamOn = {
      services: {
        streaming: [preferredService, otherStreamingService],
        onDemand: [onDemandService],
      },
      preferred: preferredService,
    };

    const result = mapToServices(streamOn);
    expect(result).toEqual([
      {
        ...preferredService,
        id: 'streaming-netflix',
      },
      {
        ...otherStreamingService,
        id: 'streaming-hulu',
      },
      {
        ...onDemandService,
        id: 'on-demand-amazon',
      },
    ]);
  });

  it('should handle mixed streaming and on-demand services with preferred', () => {
    const preferredService: StreamNow = {
      link: 'https://disney.com',
      source: 'disney',
      is4k: true,
      type: 'streaming',
    };

    const streamingService: StreamNow = {
      link: 'https://netflix.com',
      source: 'netflix',
      is4k: false,
      type: 'streaming',
    };

    const onDemandService1: StreamOnDemand = {
      link: 'https://amazon.com',
      source: 'amazon',
      is4k: false,
      currency: 'usd',
      prices: { rent: 3.99, purchase: 12.99 },
      type: 'on-demand',
    };

    const onDemandService2: StreamOnDemand = {
      link: 'https://apple.com',
      source: 'apple',
      is4k: true,
      currency: 'usd',
      prices: { purchase: 14.99 },
      type: 'on-demand',
    };

    const streamOn: StreamOn = {
      services: {
        streaming: [preferredService, streamingService],
        onDemand: [onDemandService1, onDemandService2],
      },
      preferred: preferredService,
    };

    const result = mapToServices(streamOn);
    expect(result).toHaveLength(4);

    expect(result.at(0)).toEqual({
      ...preferredService,
      id: 'streaming-disney',
    });

    expect(result.at(1)).toEqual({
      ...streamingService,
      id: 'streaming-netflix',
    });

    expect(result.at(2)).toEqual({
      ...onDemandService1,
      id: 'on-demand-amazon',
    });

    expect(result.at(3)).toEqual({
      ...onDemandService2,
      id: 'on-demand-apple',
    });
  });
});
