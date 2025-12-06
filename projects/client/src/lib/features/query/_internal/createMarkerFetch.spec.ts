import { describe, expect, it, vi } from 'vitest';
import { createMarkerFetch } from './createMarkerFetch.ts';

describe('createMarkerFetch', () => {
  const mockFetch = vi.fn(() =>
    Promise.resolve(new Response())
  ) as unknown as typeof fetch;

  it('should add marker to GET requests', async () => {
    const markerFetch = createMarkerFetch('12345', mockFetch);

    await markerFetch('https://api.example.com/data?foo=bar', {
      method: 'GET',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/data?foo=bar&marker=12345',
      { method: 'GET' },
    );
  });

  it('should add marker to GET requests without existing query params', async () => {
    const markerFetch = createMarkerFetch('67890', mockFetch);

    await markerFetch('https://api.example.com/data', { method: 'GET' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/data?marker=67890',
      { method: 'GET' },
    );
  });

  it('should add marker when method is lowercase get', async () => {
    const markerFetch = createMarkerFetch('11111', mockFetch);

    await markerFetch('https://api.example.com/data', { method: 'get' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/data?marker=11111',
      { method: 'get' },
    );
  });

  it('should not add marker to POST requests', async () => {
    const markerFetch = createMarkerFetch('12345', mockFetch);

    await markerFetch('https://api.example.com/data', { method: 'POST' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      { method: 'POST' },
    );
  });

  it('should not add marker to PUT requests', async () => {
    const markerFetch = createMarkerFetch('12345', mockFetch);

    await markerFetch('https://api.example.com/data', { method: 'PUT' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      { method: 'PUT' },
    );
  });

  it('should not add marker to DELETE requests', async () => {
    const markerFetch = createMarkerFetch('12345', mockFetch);

    await markerFetch('https://api.example.com/data', { method: 'DELETE' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      { method: 'DELETE' },
    );
  });

  it('should handle non-string input by passing through', async () => {
    const markerFetch = createMarkerFetch('12345', mockFetch);
    const request = new Request('https://api.example.com/data');

    await markerFetch(request);

    expect(mockFetch).toHaveBeenCalledWith(request, undefined);
  });

  it('should handle requests without init options', async () => {
    const markerFetch = createMarkerFetch('12345', mockFetch);

    await markerFetch('https://api.example.com/data');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/data',
      undefined,
    );
  });
});
