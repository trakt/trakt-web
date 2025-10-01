import { Client } from 'typesense';

export function createSearcher({
  key,
  server,
}: {
  key: string;
  server: string;
}): Client {
  return new Client({
    nodes: [
      {
        host: server,
        port: 443,
        protocol: 'https',
      },
    ],
    apiKey: key,
  });
}
