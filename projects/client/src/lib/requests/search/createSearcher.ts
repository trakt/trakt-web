import { Client } from 'typesense';

export function createSearcher({
  key,
  server,
}: {
  key: string;
  server: string;
}): Client {
  const url = new URL(server.includes('://') ? server : `https://${server}`);
  const protocol = url.protocol === 'http:' ? 'http' : 'https';

  return new Client({
    nodes: [
      {
        host: url.hostname,
        port: url.port ? Number(url.port) : protocol === 'http' ? 80 : 443,
        protocol,
      },
    ],
    apiKey: key,
  });
}
