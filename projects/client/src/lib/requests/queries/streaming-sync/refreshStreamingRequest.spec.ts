import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { refreshStreamingRequest } from './refreshStreamingRequest.ts';

describe('refreshStreamingRequest', () => {
  const capture = () => {
    const paths: string[] = [];
    server.use(
      http.post('http://localhost/younify/users/refresh/*', ({ request }) => {
        paths.push(new URL(request.url).pathname);
        return new HttpResponse(null, { status: 201 });
      }),
    );
    return paths;
  };

  it('should request a full re-sync with all_data set to true', async () => {
    const paths = capture();

    const result = await refreshStreamingRequest({
      serviceId: 'netflix',
      allData: true,
    });

    expect(paths).toEqual(['/younify/users/refresh/netflix/true']);
    expect(result).toBe(true);
  });

  it('should request an incremental re-sync without all_data', async () => {
    const paths = capture();

    const result = await refreshStreamingRequest({ serviceId: 'netflix' });

    expect(paths).toEqual(['/younify/users/refresh/netflix']);
    expect(result).toBe(true);
  });
});
