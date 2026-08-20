import { server } from '$mocks/server.ts';

export async function captureRequests(
  run: () => Promise<void>,
): Promise<string[]> {
  const requests: string[] = [];
  const record = ({ request }: { request: Request }) => {
    requests.push(`${request.method} ${new URL(request.url).pathname}`);
  };

  server.events.on('request:start', record);
  try {
    await run();
  } finally {
    server.events.removeListener('request:start', record);
  }

  return requests;
}
